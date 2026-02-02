import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Mail, Shield, Upload, Package } from 'lucide-react';
import { itemsAPI, claimsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

// Image component with error fallback
const ItemImage = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <Package className="w-16 h-16 text-gray-400" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover rounded-lg"
      onError={() => setHasError(true)}
    />
  );
};

const Claim = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  
  const [formData, setFormData] = useState({
    proofDescription: '',
    contactEmail: user?.email || '',
    contactPhone: ''
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await itemsAPI.getOne(itemId);
        if (response.data.status !== 'available') {
          toast.error('This item is not available for claiming');
          navigate('/browse');
          return;
        }
        setItem(response.data);
      } catch (error) {
        toast.error('Item not found');
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.proofDescription) {
      toast.error('Please provide proof of ownership');
      return;
    }
    
    if (formData.proofDescription.length < 20) {
      toast.error('Please provide more detail about your proof of ownership');
      return;
    }

    setSubmitting(true);

    try {
      const response = await claimsAPI.create({
        itemId,
        proofDescription: formData.proofDescription,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone
      });
      
      setReferenceId(response.data.referenceId);
      setSubmitted(true);
      toast.success('Claim submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600"></div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="w-20 h-20 bg-skyblue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-10 h-10 text-navy-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('claimForm.success.title')}</h2>
          <p className="text-gray-600 mb-4">
            {t('claimForm.success.message')}
          </p>
          <div className="bg-navy-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-navy-600">{t('report.success.reference')}</p>
            <p className="text-xl font-bold text-navy-800">{referenceId}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <p className="text-sm text-gray-500">{t('claimForm.confirmationSentTo') || 'Confirmation will be sent to:'}</p>
            <p className="font-medium">{formData.contactEmail}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/my-claims')}
              className="flex-1 bg-navy-600 text-white py-3 rounded-lg font-medium hover:bg-navy-700 transition"
            >
              {t('claimForm.success.viewClaims')}
            </button>
            <button
              onClick={() => navigate('/browse')}
              className="flex-1 border border-navy-600 text-navy-600 py-3 rounded-lg font-medium hover:bg-navy-50 transition"
            >
              {t('browse.viewDetails') || 'Browse More'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-navy-600 hover:text-navy-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          {t('common.back')}
        </button>

        {/* Item Summary */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
            <ItemImage src={item?.image_url} alt={item?.name} />
          </div>
          <div>
            <h3 className="font-bold text-lg">{item?.name}</h3>
            <p className="text-gray-500 text-sm">📍 {item?.location_name}</p>
            <p className="text-gray-500 text-sm">📅 {t('itemDetail.dateFound')}: {new Date(item?.found_date).toLocaleDateString(language === 'zh' ? 'zh-CN' : language === 'hi' ? 'hi-IN' : language)}</p>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-navy-600" />
            <h1 className="text-2xl font-bold">{t('claimForm.title')}</h1>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>{t('claimForm.importantLabel') || 'Important'}:</strong> {t('claimForm.proofHelp')}
            </p>
          </div>

          <div className="space-y-6">
            {/* Proof of Ownership */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                {t('claimForm.proofLabel')} *
              </label>
              <textarea
                value={formData.proofDescription}
                onChange={(e) => setFormData({ ...formData, proofDescription: e.target.value })}
                rows={5}
                placeholder={t('claimForm.proofPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.proofDescription.length}/20 {t('request.form.descriptionMin') || 'characters minimum'}
              </p>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  {t('claimForm.contactEmail')} *
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="your.email@school.edu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  {t('claimForm.contactPhone')}
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="(770) 555-0123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-navy-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-navy-700 transition disabled:opacity-50 flex items-center justify-center"
            >
              {submitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('claimForm.submit')}
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              {t('claimForm.disclaimer') || 'By submitting, you confirm this item belongs to you. False claims may result in account suspension.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Claim;