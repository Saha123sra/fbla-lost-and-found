import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Upload, CheckCircle, ArrowRight, Package } from 'lucide-react';
import { itemsAPI, testimonialsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import heroVideo from '../assets/Black White Vintage Film Look Wedding Slideshow Video (1).mp4';

const Home = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ total: 0, claimed: 0, rate: 0 });
  const [recentItems, setRecentItems] = useState([]);
  const [testimonials, setTestimonials] = useState([
    { name: "Sarah M.", grade: "Junior", text: "Found my AirPods within 2 hours of losing them! The system made it so easy.", avatar: "👩‍🎓" },
    { name: "Marcus T.", grade: "Senior", text: "I've returned 5 items through this site. It feels good to help fellow Danes!", avatar: "👨‍🎓" },
    { name: "Emily R.", grade: "Sophomore", text: "Way better than the old lost and found box. Got my calculator back before my test!", avatar: "👩‍💻" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, testimonialsRes] = await Promise.all([
          itemsAPI.getAll({ limit: 6, status: 'available' }),
          testimonialsAPI.getApproved(6)
        ]);

        setRecentItems(itemsRes.data.items || []);
        setStats({
          total: itemsRes.data.pagination?.total || 247,
          claimed: 189,
          rate: 76
        });

        if (testimonialsRes.data.data && testimonialsRes.data.data.length > 0) {
          setTestimonials(testimonialsRes.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section - Split Left/Right */}
      <section className="w-full min-h-[70vh] lg:h-screen flex flex-row">
        {/* Left - Colored Section (full width on mobile/tablet, half on desktop) */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-navy-800 via-navy-700 to-carolina-500 flex flex-col justify-center px-8 md:px-16 py-16 lg:py-0 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {t('home.hero.title')}
            <br />
            <span className="text-carolina-300">{t('home.hero.tagline')}</span>
          </h1>
          <p className="text-lg md:text-xl text-carolina-100 mb-8 max-w-lg">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/browse"
              className="inline-flex items-center justify-center bg-white text-navy-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-carolina-100 transition shadow-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              {t('home.hero.browseCta')}
            </Link>
            <Link
              to="/report"
              className="inline-flex items-center justify-center bg-carolina-400 text-navy-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-carolina-300 transition border-2 border-carolina-300"
            >
              <Upload className="w-5 h-5 mr-2" />
              {t('home.hero.reportCta')}
            </Link>
          </div>
        </div>

        {/* Right - Video / Slideshow (hidden on mobile/tablet, visible on desktop) */}
        <div className="hidden lg:flex lg:w-1/2 relative justify-center items-center overflow-hidden bg-navy-900">
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-90"
          />
          {/* Subtle overlay for better text contrast if needed */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-navy-900/20 pointer-events-none" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl text-navy-800">{stats.total}</div>
              <div className="text-gray-600 mt-1">{t('home.stats.itemsFound')}</div>
            </div>
            <div className="p-4">

              <div className="text-4xl font-bold text-carolina-500">{stats.claimed}</div>
              <div className="text-gray-600 mt-1">{t('home.stats.itemsReturned')}</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-navy-800">{stats.rate}%</div>
              <div className="text-gray-600 mt-1">{t('home.stats.returnRate', 'Return Rate')}</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-carolina-500">24h</div>
              <div className="text-gray-600 mt-1">{t('home.stats.avgReturnTime', 'Avg. Return Time')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-navy-800">{t('home.howItWorks.title')}</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            {t('home.howItWorks.subtitle', 'Our simple 3-step process makes finding lost items easier than ever')}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-carolina-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-navy-800" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-navy-800">1. {t('home.howItWorks.step1Title')}</h3>
              <p className="text-gray-600">{t('home.howItWorks.step1Desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-carolina-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-navy-800" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-navy-800">2. {t('home.howItWorks.step2Title')}</h3>
              <p className="text-gray-600">{t('home.howItWorks.step2Desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-carolina-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-navy-800" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-navy-800">3. {t('home.howItWorks.step3Title')}</h3>
              <p className="text-gray-600">{t('home.howItWorks.step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-navy-800">What Danes Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">{testimonial.avatar}</span>
                  <div>
                    <div className="font-bold text-navy-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.grade}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('home.cta.title', 'Found Something?')}</h2>
          <p className="text-carolina-200 mb-8 text-lg">
            {t('home.cta.subtitle', 'Help a fellow Dane by reporting it. It only takes a minute!')}
          </p>
          <Link
            to="/report"
            className="inline-flex items-center bg-carolina-400 text-navy-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-carolina-300 transition"
          >
            <Package className="w-5 h-5 mr-2" />
            {t('home.hero.reportCta')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
