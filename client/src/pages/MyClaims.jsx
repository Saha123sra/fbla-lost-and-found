import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, AlertCircle, MapPin, Calendar } from 'lucide-react';
import { claimsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

// Image component with error fallback
const ItemImage = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <Package className="w-12 h-12 text-gray-400" />;
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

const MyClaims = () => {
  const { t } = useLanguage();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await claimsAPI.getAll();
      setClaims(response.data);
    } catch (error) {
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (claimId) => {
    if (!window.confirm('Are you sure you want to cancel this claim?')) return;
    
    try {
      await claimsAPI.cancel(claimId);
      toast.success('Claim cancelled');
      fetchClaims();
    } catch (error) {
      toast.error('Failed to cancel claim');
    }
  };

  const filteredClaims = claims.filter(claim => {
    if (filter === 'all') return true;
    return claim.status === filter;
  });

  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: t('claims.status.pending') },
    approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: t('claims.status.approved') },
    denied: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: t('claims.status.denied') },
    cancelled: { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-100', label: t('claims.status.cancelled') },
    picked_up: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: t('claims.status.pickedUp', 'Picked Up') }
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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('claims.title')}</h1>
            <p className="text-gray-600 mt-1">{t('claims.subtitle', 'Track the status of your item claims')}</p>
          </div>
          <Link
            to="/browse"
            className="mt-4 md:mt-0 inline-flex items-center bg-navy-600 text-white px-4 py-2 rounded-lg hover:bg-navy-700 transition"
          >
            <Package className="w-4 h-4 mr-2" />
            {t('nav.browse')}
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'approved', 'denied'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-navy-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'all' && ` (${claims.length})`}
              {status !== 'all' && ` (${claims.filter(c => c.status === status).length})`}
            </button>
          ))}
        </div>

        {/* Claims List */}
        {filteredClaims.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">{t('claims.noClaims')}</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'all'
                ? t('claims.noClaimsYet', "You haven't submitted any claims yet.")
                : t('claims.noFilteredClaims', `No ${filter} claims.`)}
            </p>
            <Link
              to="/browse"
              className="text-navy-600 hover:underline"
            >
              {t('claims.browseItems', 'Browse items to claim')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClaims.map((claim) => {
              const status = statusConfig[claim.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              
              return (
                <div key={claim.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Item Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        <ItemImage src={claim.image_url} alt={claim.item_name} />
                      </div>

                      {/* Claim Details */}
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg">{claim.item_name}</h3>
                            <p className="text-gray-500 text-sm">
                              Claimed on {new Date(claim.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {status.label}
                          </span>
                        </div>

                        {/* Pickup Info (if approved) */}
                        {claim.status === 'approved' && claim.pickup_date && (
                          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-medium text-green-800 mb-2">📍 Pickup Information</h4>
                            <div className="grid md:grid-cols-3 gap-2 text-sm">
                              <div className="flex items-center text-green-700">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(claim.pickup_date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-green-700">
                                <Clock className="w-4 h-4 mr-1" />
                                {claim.pickup_time}
                              </div>
                              <div className="flex items-center text-green-700">
                                <MapPin className="w-4 h-4 mr-1" />
                                {claim.pickup_location}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Denial Reason */}
                        {claim.status === 'denied' && claim.denial_reason && (
                          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700 text-sm">
                              <strong>Reason:</strong> {claim.denial_reason}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        {claim.status === 'pending' && (
                          <div className="mt-4">
                            <button
                              onClick={() => handleCancel(claim.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Cancel Claim
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClaims;