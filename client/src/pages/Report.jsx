import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, X, Camera, MapPin } from 'lucide-react';
import { itemsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const Report = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    locationId: '',
    locationDetail: '',
    foundDate: new Date().toISOString().split('T')[0],
    image: null
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, locRes] = await Promise.all([
          itemsAPI.getCategories(),
          itemsAPI.getLocations()
        ]);
        setCategories(catRes.data);
        setLocations(locRes.data);
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
      }
    };
    fetchMetadata();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData({ ...formData, image: file });
    } else {
      toast.error('Please select an image file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.categoryId || !formData.locationId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await itemsAPI.create(formData);
      setReferenceId(response.data.referenceId);
      setSubmitted(true);
      toast.success('Item reported successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to report item');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('report.success.title')}</h2>
          <p className="text-gray-600 mb-4">
            {t('report.success.message')}
          </p>
          <div className="bg-navy-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-navy-600">{t('report.success.reference')}</p>
            <p className="text-xl font-bold text-navy-800">{referenceId}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '', description: '', categoryId: '', locationId: '',
                  locationDetail: '', foundDate: new Date().toISOString().split('T')[0], image: null
                });
              }}
              className="flex-1 bg-navy-600 text-white py-3 rounded-lg font-medium hover:bg-navy-700 transition"
            >
              {t('report.success.reportAnother')}
            </button>
            <button
              onClick={() => navigate('/browse')}
              className="flex-1 border border-navy-600 text-navy-600 py-3 rounded-lg font-medium hover:bg-navy-50 transition"
            >
              {t('report.success.viewItems')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('report.title')}</h1>
          <p className="text-gray-600 mt-2">{t('report.subtitle')}</p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                <Camera className="w-4 h-4 inline mr-1" />
                {t('report.form.photo')}
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer
                  ${dragActive ? 'border-navy-500 bg-navy-50' : 'border-gray-300 hover:border-navy-400'}`}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById('image-input').click()}
              >
                {formData.image ? (
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="max-h-48 rounded-lg mx-auto"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, image: null }); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">{t('common.dragDrop')}</p>
                    <p className="text-navy-600 font-medium">{t('common.orClick')}</p>
                  </>
                )}
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                />
              </div>
            </div>

            {/* Item Name */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">{t('report.form.name')} *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('report.form.namePlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none"
              />
            </div>

            {/* Category & Location */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">{t('report.form.category')} *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none"
                >
                  <option value="">{t('report.form.selectCategory')}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {t('report.form.location')} *
                </label>
                <select
                  name="locationId"
                  value={formData.locationId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none"
                >
                  <option value="">{t('report.form.selectLocation')}</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location Detail & Date */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">{t('report.form.specificLocation')}</label>
                <input
                  type="text"
                  name="locationDetail"
                  value={formData.locationDetail}
                  onChange={handleChange}
                  placeholder={t('report.form.specificLocationPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">{t('report.form.dateFound')}</label>
                <input
                  type="date"
                  name="foundDate"
                  value={formData.foundDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">{t('report.form.description')} *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder={t('report.form.descriptionPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none resize-none"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-navy-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-navy-700 transition disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  {t('report.form.submit')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;