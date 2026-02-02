import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { faqAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const FAQ = () => {
  const { t } = useLanguage();
  const [faqs, setFaqs] = useState([]);
  const [groupedFaqs, setGroupedFaqs] = useState({});
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await faqAPI.getAll();
        setFaqs(response.data.data || []);
        setGroupedFaqs(response.data.grouped || {});
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFaqs = searchQuery
    ? faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const getCategoryIcon = (category) => {
    const icons = {
      'Reporting': '📝',
      'Searching': '🔍',
      'Claims': '✋',
      'Policies': '📋',
      'Pickup': '📍',
      'Security': '🔒',
      'Features': '✨',
      'Support': '💬',
      'General': '❓'
    };
    return icons[category] || '❓';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-carolina-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-navy-700" />
          </div>
          <h1 className="text-3xl font-bold text-navy-800 mb-2">{t('faq.title')}</h1>
          <p className="text-gray-600">{t('faq.subtitle')}</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('faq.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none shadow-sm"
          />
        </div>

        {/* FAQs */}
        {searchQuery ? (
          // Search results (flat list)
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {t('faq.noResults')}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border-b border-gray-100 last:border-0">
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                    >
                      <span className="font-medium text-gray-800 pr-4">{faq.question}</span>
                      {openItems[faq.id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                      )}
                    </button>
                    {openItems[faq.id] && (
                      <div className="px-6 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Grouped by category
          <div className="space-y-6">
            {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
              <div key={category} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <h2 className="font-bold text-navy-800 flex items-center gap-2">
                    <span>{getCategoryIcon(category)}</span>
                    {category}
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {categoryFaqs.map((faq) => (
                    <div key={faq.id}>
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                      >
                        <span className="font-medium text-gray-800 pr-4">{faq.question}</span>
                        {openItems[faq.id] ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                        )}
                      </button>
                      {openItems[faq.id] && (
                        <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact */}
        <div className="mt-8 bg-navy-50 border border-navy-200 rounded-xl p-6 text-center">
          <h3 className="font-bold text-navy-800 mb-2">{t('faq.stillNeedHelp')}</h3>
          <p className="text-navy-600 mb-4">
            {t('faq.contactUs')}{' '}
            <a href="mailto:lostdanefound@forsyth.k12.ga.us" className="underline">
              lostdanefound@forsyth.k12.ga.us
            </a>
          </p>
          <p className="text-sm text-navy-500">
            {t('faq.visitOffice') || 'Or visit the Main Office during school hours'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
