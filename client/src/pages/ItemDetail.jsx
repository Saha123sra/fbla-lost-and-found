import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Tag, User, Clock, CheckCircle, Package, Edit } from 'lucide-react';
import { itemsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

// Image component with error fallback
const ItemImage = ({ src, alt, className }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <Package className="w-24 h-24 text-gray-400" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await itemsAPI.getOne(id);
        setItem(response.data);
      } catch (err) {
        setError('Item not found');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('itemDetail.notFound')}</h2>
          <p className="text-gray-600 mb-4">{t('common.error')}</p>
          <button onClick={() => navigate('/browse')} className="text-navy-600 hover:underline">
            ← {t('itemDetail.backToBrowse')}
          </button>
        </div>
      </div>
    );
  }

  const statusColors = {
    available: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    claimed: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const statusLabels = {
    available: t('browse.filter.available'),
    pending: t('browse.filter.pendingClaim'),
    claimed: t('browse.filter.claimed')
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/browse')}
          className="flex items-center text-navy-600 hover:text-navy-700 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition" />
          {t('itemDetail.backToBrowse')}
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
              <ItemImage src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-6 md:p-8">
              {/* Status Badge and Edit Button */}
              <div className="flex items-center justify-between mb-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors[item.status]}`}>
                  {item.status === 'available' && <CheckCircle className="w-4 h-4 mr-1" />}
                  {statusLabels[item.status]}
                </div>

                {/* Edit Button - only for the person who reported or admin */}
                {(user?.id === item.found_by || isAdmin) && (
                  <Link
                    to={`/items/${item.id}/edit`}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-navy-600 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    {t('common.edit')}
                  </Link>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{item.name}</h1>
              
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <Tag className="w-4 h-4 mr-1" />
                {item.category_name}
              </div>

              <p className="text-gray-700 mb-6">{item.description}</p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {t('itemDetail.location')}
                  </div>
                  <p className="font-medium text-gray-800">
                    {item.location_name}
                    {item.location_detail && <span className="text-gray-600"> - {item.location_detail}</span>}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {t('itemDetail.dateFound')}
                  </div>
                  <p className="font-medium text-gray-800">
                    {new Date(item.found_date).toLocaleDateString(language === 'zh' ? 'zh-CN' : language === 'hi' ? 'hi-IN' : language, {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                {item.found_by_name && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-gray-500 text-sm mb-1">
                      <User className="w-4 h-4 mr-1" />
                      {t('itemDetail.reportedBy')}
                    </div>
                    <p className="font-medium text-gray-800">{item.found_by_name}</p>
                  </div>
                )}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {t('itemDetail.status')}
                  </div>
                  <p className="font-medium text-gray-800">
                    {new Date(item.date_reported).toLocaleDateString(language === 'zh' ? 'zh-CN' : language === 'hi' ? 'hi-IN' : language)}
                  </p>
                </div>
              </div>

              {/* Claim Button */}
              {item.status === 'available' && (
                isAuthenticated ? (
                  <Link
                    to={`/claim/${item.id}`}
                    className="block w-full bg-navy-600 text-white py-4 rounded-lg font-bold text-center hover:bg-navy-700 transition"
                  >
                    {t('itemDetail.claimItem')}
                  </Link>
                ) : (
                  <div>
                    <Link
                      to="/login"
                      state={{ from: { pathname: `/claim/${item.id}` } }}
                      className="block w-full bg-navy-600 text-white py-4 rounded-lg font-bold text-center hover:bg-navy-700 transition"
                    >
                      {t('common.loginRequired')}
                    </Link>
                    <p className="text-center text-sm text-gray-500 mt-2">
                      {t('common.loginRequiredDesc')}
                    </p>
                  </div>
                )
              )}

              {item.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-yellow-800">
                    {t('itemDetail.pendingClaim')}
                  </p>
                </div>
              )}

              {item.status === 'claimed' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-gray-600">
                    {t('itemDetail.alreadyClaimed')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;