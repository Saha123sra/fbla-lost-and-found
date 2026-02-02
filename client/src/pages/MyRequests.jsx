import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Calendar, MapPin, X, ExternalLink, Trash2 } from 'lucide-react';
import { requestsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const MyRequests = () => {
  const { t, language } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await requestsAPI.getAll();
      setRequests(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;

    try {
      await requestsAPI.cancel(id);
      toast.success('Request cancelled');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to cancel request');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-blue-100 text-blue-700',
      matched: 'bg-green-100 text-green-700',
      cancelled: 'bg-gray-100 text-gray-700',
      expired: 'bg-yellow-100 text-yellow-700'
    };

    const labels = {
      active: t('myRequests.status.active'),
      matched: t('myRequests.status.matched'),
      cancelled: t('myRequests.status.cancelled'),
      expired: t('myRequests.status.expired') || 'Expired'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.active}`}>
        {labels[status] || status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('myRequests.title')}</h1>
            <p className="text-gray-600">{t('myRequests.subtitle') || 'Track items you\'ve pre-registered as lost'}</p>
          </div>
          <Link
            to="/request"
            className="bg-navy-600 text-white px-4 py-2 rounded-lg hover:bg-navy-700 transition flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {t('myRequests.newRequest') || 'New Request'}
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">{t('myRequests.noRequests')}</h3>
            <p className="text-gray-500 mb-4">
              {t('myRequests.noRequestsDesc') || 'Pre-register lost items to get notified when they\'re found'}
            </p>
            <Link
              to="/request"
              className="inline-block bg-navy-600 text-white px-6 py-2 rounded-lg hover:bg-navy-700 transition"
            >
              {t('myRequests.createNew')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow p-4 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 truncate">
                          {request.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          {request.category_name && (
                            <span className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              {request.category_name}
                            </span>
                          )}
                          {request.location_name && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {request.location_name}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {t('myRequests.dateLost')}: {new Date(request.lost_date).toLocaleDateString(language === 'zh' ? 'zh-CN' : language === 'hi' ? 'hi-IN' : language)}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {request.description}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-3">
                      {request.status === 'matched' && request.matched_item_id && (
                        <Link
                          to={`/items/${request.matched_item_id}`}
                          className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t('myRequests.viewMatch') || 'View Match'}
                        </Link>
                      )}
                      {request.status === 'active' && (
                        <button
                          onClick={() => handleCancel(request.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          {t('myRequests.cancel')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-medium text-blue-800 mb-2">{t('myRequests.howMatchingWorks') || 'How matching works'}</h3>
          <p className="text-blue-700 text-sm">
            {t('myRequests.howMatchingWorksDesc') || "When someone reports a found item that matches your description, you'll receive an email notification. You can then view the item and submit a claim if it's yours."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyRequests;
