import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Package, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { itemsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

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
      className="w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  );
};

const Browse = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0 });

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await itemsAPI.getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);

      try {
        // Build query params
        const params = {
          page: pagination.page,
          limit: pagination.limit
        };

        if (search) params.search = search;
        if (category) params.category = category;
        if (priority) params.priority = priority.toLowerCase();
        if (status && status !== 'all') params.status = status.toLowerCase();
        if (duration) {
          const today = new Date();
          let daysAgo;
          switch (duration) {
            case '1 week': daysAgo = 7; break;
            case '2 weeks': daysAgo = 14; break;
            case '1 month': daysAgo = 30; break;
            case '>1 month': daysAgo = 31; break;
            default: daysAgo = 0;
          }
          if (daysAgo > 0) {
            const dateThreshold = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
            if (duration === '>1 month') {
              params.foundBefore = dateThreshold.toISOString().split('T')[0];
            } else {
              params.foundAfter = dateThreshold.toISOString().split('T')[0];
            }
          }
        }

        const response = await itemsAPI.getAll(params);
        setItems(response.data.items || response.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination?.total || response.data.length || 0
        }));
      } catch (error) {
        console.error('Error fetching items:', error);
        setItems([]);
      }

      setLoading(false);
    };

    fetchItems();
  }, [search, category, duration, priority, status, pagination.page, pagination.limit]);

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setDuration('');
    setPriority('');
    setStatus('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getStatusBadge = (itemStatus) => {
    const styles = {
      available: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      claimed: 'bg-gray-100 text-gray-700'
    };
    const labels = {
      available: 'Available',
      pending: 'Pending Claim',
      claimed: 'Claimed'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[itemStatus] || styles.available}`}>
        {labels[itemStatus] || itemStatus}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('browse.title')}</h1>
          <p className="text-gray-600 mt-2">{t('browse.subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('browse.search')}
                value={search}
                onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none"
              />
            </div>

            {/* Category */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={category}
                onChange={e => { setCategory(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none min-w-[150px] ${!category ? 'text-gray-400 italic' : 'text-gray-800'}`}
              >
                <option value="" disabled hidden>
                  {t('browse.filter.category')}
                </option>
                <option value="">{t('browse.filter.all')}</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <select
              value={duration}
              onChange={e => { setDuration(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none ${!duration ? 'text-gray-400 italic' : 'text-gray-800'}`}
            >
              <option value="" disabled hidden>
                {t('browse.filter.duration', 'Duration')}
              </option>
              <option value="">{t('browse.filter.anyTime', 'Any Time')}</option>
              <option value="1 week">{t('browse.filter.lastWeek', 'Last Week')}</option>
              <option value="2 weeks">{t('browse.filter.last2Weeks', 'Last 2 Weeks')}</option>
              <option value="1 month">{t('browse.filter.lastMonth', 'Last Month')}</option>
              <option value=">1 month">{t('browse.filter.olderThanMonth', 'Older than 1 Month')}</option>
            </select>

            {/* Priority */}
            <select
              value={priority}
              onChange={e => { setPriority(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none ${!priority ? 'text-gray-400 italic' : 'text-gray-800'}`}
            >
              <option value="" disabled hidden>
                {t('browse.filter.priority', 'Priority')}
              </option>
              <option value="">{t('browse.filter.anyPriority', 'Any Priority')}</option>
              <option value="High">{t('browse.filter.highPriority', 'High Priority')}</option>
              <option value="Low">{t('browse.filter.lowPriority', 'Low Priority')}</option>
            </select>

            {/* Availability */}
            <select
              value={status}
              onChange={e => { setStatus(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none ${!status ? 'text-gray-400 italic' : 'text-gray-800'}`}
            >
              <option value="" disabled hidden>
                {t('browse.filter.availability', 'Availability')}
              </option>
              <option value="">{t('browse.filter.availableOnly', 'Available Only')}</option>
              <option value="available">{t('browse.filter.available', 'Available')}</option>
              <option value="pending">{t('browse.filter.pendingClaim', 'Pending Claim')}</option>
              <option value="claimed">{t('browse.filter.claimed', 'Claimed')}</option>
              <option value="all">{t('browse.filter.allItems', 'All Items')}</option>
            </select>
          </div>

          {/* Active Filters */}
          {(search || category || duration || priority || status) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
              {search && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1 text-sm">
                  Search: {search}
                  <button onClick={() => setSearch('')}><X className="w-3 h-3"/></button>
                </span>
              )}
              {category && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full flex items-center gap-1 text-sm">
                  Category: {categories.find(c => c.id == category)?.name}
                  <button onClick={() => setCategory('')}><X className="w-3 h-3"/></button>
                </span>
              )}
              {duration && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1 text-sm">
                  Duration: {duration}
                  <button onClick={() => setDuration('')}><X className="w-3 h-3"/></button>
                </span>
              )}
              {priority && (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full flex items-center gap-1 text-sm">
                  Priority: {priority}
                  <button onClick={() => setPriority('')}><X className="w-3 h-3"/></button>
                </span>
              )}
              {status && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-1 text-sm">
                  Status: {status}
                  <button onClick={() => setStatus('')}><X className="w-3 h-3"/></button>
                </span>
              )}
              <button onClick={resetFilters} className="text-sm text-red-600 hover:underline ml-2">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600"></div>
          </div>
        ) : items.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map(item => (
              <Link
                key={item.id}
                to={`/items/${item.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                  <ItemImage src={item.image_url} alt={item.name} />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(item.status)}
                  </div>
                  {item.priority === 'high' && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      High Priority
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg group-hover:text-navy-600 transition line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>{item.category_name || 'Uncategorized'}</span>
                    <span>{new Date(item.found_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">{t('browse.noItems')}</h3>
            <p className="text-gray-400 mt-2">{t('browse.tryAdjusting', 'Try adjusting your search or filters')}</p>
            <button onClick={resetFilters} className="mt-4 text-navy-600 hover:underline">
              {t('browse.clearFilters', 'Clear all filters')}
            </button>
          </div>
        )}

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5"/>
            </button>
            <span className="text-gray-600">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <button
              onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page * pagination.limit >= pagination.total}
              className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5"/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
