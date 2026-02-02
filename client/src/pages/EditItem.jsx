import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, ArrowLeft, Save, Package } from 'lucide-react';
import { itemsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [item, setItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    locationId: '',
    locationDetail: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemRes, catRes, locRes] = await Promise.all([
          itemsAPI.getOne(id),
          itemsAPI.getCategories(),
          itemsAPI.getLocations()
        ]);

        const itemData = itemRes.data;
        setItem(itemData);

        // Check authorization
        if (itemData.found_by !== user?.id && user?.role !== 'admin') {
          toast.error('You are not authorized to edit this item');
          navigate(`/items/${id}`);
          return;
        }

        setFormData({
          name: itemData.name || '',
          description: itemData.description || '',
          categoryId: itemData.category_id || '',
          locationId: itemData.location_id || '',
          locationDetail: itemData.location_detail || ''
        });

        if (itemData.image_url) {
          setImagePreview(itemData.image_url);
        }

        setCategories(catRes.data || []);
        setLocations(locRes.data || []);
      } catch (error) {
        console.error('Error fetching item:', error);
        toast.error('Failed to load item');
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(item?.image_url || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('categoryId', formData.categoryId);
      data.append('locationId', formData.locationId);
      data.append('locationDetail', formData.locationDetail);

      if (imageFile) {
        data.append('image', imageFile);
      }

      await itemsAPI.update(id, data);
      toast.success('Item updated successfully!');
      navigate(`/items/${id}`);
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error(error.response?.data?.error || 'Failed to update item');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/items/${id}`)}
          className="flex items-center text-gray-600 hover:text-navy-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Item
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-navy-800 mb-6">Edit Item</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Photo
              </label>
              <div className="relative">
                {imagePreview ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-navy-500 hover:bg-gray-50 transition">
                    <Package className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-gray-500">Click to upload image</span>
                    <span className="text-gray-400 text-sm">PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}

                {imagePreview && (
                  <label className="mt-2 inline-flex items-center text-sm text-navy-600 hover:text-navy-700 cursor-pointer">
                    <Upload className="w-4 h-4 mr-1" />
                    Change image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Blue Nike Backpack"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the item in detail..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent outline-none resize-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent outline-none"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Found *
              </label>
              <select
                value={formData.locationId}
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent outline-none"
                required
              >
                <option value="">Select a location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Detail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specific Location (Optional)
              </label>
              <input
                type="text"
                value={formData.locationDetail}
                onChange={(e) => setFormData({ ...formData, locationDetail: e.target.value })}
                placeholder="e.g., Near the water fountain"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(`/items/${id}`)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-navy-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-navy-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditItem;
