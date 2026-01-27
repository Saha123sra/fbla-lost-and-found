import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Package, Calendar, MapPin, CheckCircle, Upload, X, Image, Bell } from 'lucide-react';
import { requestsAPI, itemsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

// Image component with error fallback
const ItemImage = ({ src, alt, size = 'small' }) => {
  const [hasError, setHasError] = useState(false);
  const iconSize = size === 'small' ? 'w-8 h-8' : 'w-16 h-16';

  if (!src || hasError) {
    return <Package className={`${iconSize} text-gray-400`} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  );
};

const Request = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Matching feature states
  const [showMatchesModal, setShowMatchesModal] = useState(false);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [checkingMatches, setCheckingMatches] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    locationId: '',
    lostDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, locRes] = await Promise.all([
          itemsAPI.getCategories(),
          itemsAPI.getLocations()
        ]);
        setCategories(catRes.data || []);
        setLocations(locRes.data || []);
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
      }
    };
    fetchMetadata();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill in name and description');
      return;
    }

    if (formData.description.length < 20) {
      toast.error('Please provide a more detailed description (at least 20 characters)');
      return;
    }

    setCheckingMatches(true);

    try {
      // First check for potential matches
      const matchResponse = await requestsAPI.checkMatches({
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId || null
      });

      if (matchResponse.data.hasMatches && matchResponse.data.matches.length > 0) {
        setPotentialMatches(matchResponse.data.matches);
        setShowMatchesModal(true);
        setCheckingMatches(false);
        return;
      }

      // No matches found, proceed with creating request
      await createRequest();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to check for matches');
      setCheckingMatches(false);
    }
  };

  const createRequest = async () => {
    setLoading(true);
    setShowMatchesModal(false);

    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId || null,
        locationId: formData.locationId || null,
        lostDate: formData.lostDate
      };

      // Add image if selected
      if (imageFile) {
        submitData.image = imageFile;
      }

      await requestsAPI.create(submitData);

      setSubmitted(true);
      toast.success('Lost item request submitted! We\'ll notify you when a matching item is found.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit request');
    } finally {
      setLoading(false);
      setCheckingMatches(false);
    }
  };

  const handleClaimMatch = (itemId) => {
    setShowMatchesModal(false);
    navigate(`/claim/${itemId}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">{t('common.loginRequired')}</h2>
          <p className="text-gray-500 mb-4">{t('common.loginRequiredDesc')}</p>
          <Link
            to="/login"
            className="bg-navy-600 text-white px-6 py-2 rounded-lg hover:bg-navy-700 transition"
          >
            {t('nav.login')}
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('request.success.title')}</h2>
          <p className="text-gray-600 mb-6">
            {t('request.success.message')}
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <p className="font-medium text-gray-700">{formData.name}</p>
            <p className="text-sm text-gray-500 mt-1">{formData.description.substring(0, 100)}...</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/my-requests')}
              className="flex-1 bg-navy-600 text-white py-3 rounded-lg font-medium hover:bg-navy-700 transition"
            >
              {t('request.success.viewRequests')}
            </button>
            <button
              onClick={() => navigate('/browse')}
              className="flex-1 border border-navy-600 text-navy-600 py-3 rounded-lg font-medium hover:bg-navy-50 transition"
            >
              {t('request.success.browseItems')}
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

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-carolina-100 rounded-full flex items-center justify-center">
              <Search className="w-6 h-6 text-navy-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy-800">{t('request.title')}</h1>
              <p className="text-gray-500 text-sm">{t('request.subtitle')}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>{t('request.howItWorks')}</strong> {t('request.howItWorksDesc')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Item Name */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                {t('request.form.name')} *
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('request.form.namePlaceholder')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                {t('request.form.description')} *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder={t('request.form.descriptionPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/20 {t('request.form.descriptionMin')}
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                {t('request.form.photo')}
              </label>
              <p className="text-sm text-gray-500 mb-3">
                {t('request.form.photoHelp')}
              </p>

              {!imagePreview ? (
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-navy-500 bg-navy-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium mb-1">
                      {t('common.dragDrop')}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {t('common.orClick')} ({t('common.maxSize')})
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Image className="w-3 h-3" />
                    {imageFile?.name}
                  </div>
                </div>
              )}
            </div>

            {/* Category & Location */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  {t('request.form.category')}
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 outline-none"
                >
                  <option value="">{t('report.form.selectCategory')}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  {t('request.form.location')}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="locationId"
                    value={formData.locationId}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 outline-none"
                  >
                    <option value="">{t('report.form.selectLocation')}</option>
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Lost Date */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                {t('request.form.dateLost')}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="lostDate"
                  value={formData.lostDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || checkingMatches}
              className="w-full bg-navy-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-navy-700 transition disabled:opacity-50 flex items-center justify-center"
            >
              {loading || checkingMatches ? (
                <div className="flex items-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {checkingMatches ? 'Checking for matches...' : 'Submitting...'}
                </div>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  {t('request.form.submit')}
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              {t('request.manageNote', 'You can view and manage your requests in')}{' '}
              <Link to="/my-requests" className="text-navy-600 hover:underline">
                {t('nav.myRequests')}
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Potential Matches Modal */}
      {showMatchesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Search className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">We Found Similar Items!</h2>
                    <p className="text-gray-500 text-sm">Is any of these yours?</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMatchesModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="space-y-4">
                {potentialMatches.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-navy-300 hover:bg-navy-50 transition cursor-pointer"
                    onClick={() => handleClaimMatch(item.id)}
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      <ItemImage src={item.image_url} alt={item.name} size="small" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        {item.location_name && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.location_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.found_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button className="shrink-0 bg-navy-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy-700 transition">
                      Claim This
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  None of these? No problem!
                </p>
                <button
                  onClick={createRequest}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      Continue & Get Notified
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We'll send you an email notification when someone reports an item similar to yours.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;
