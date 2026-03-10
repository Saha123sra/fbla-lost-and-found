import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Hash, GraduationCap, User, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const CompleteGoogleRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeGoogleRegistration } = useAuth();
  const { t } = useLanguage();

  const [googleData, setGoogleData] = useState(null);
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    studentId: '',
    gradeLevel: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const gradeOptions = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

  useEffect(() => {
    // Get Google data from navigation state
    if (location.state?.googleData) {
      setGoogleData(location.state.googleData);
      setRole(location.state.role || 'student');
    } else {
      // No Google data, redirect to login
      navigate('/login');
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.studentId.trim()) {
      newErrors.studentId = role === 'admin' ? 'Admin ID is required' : 'Student ID is required';
    }

    if (role === 'student' && !formData.gradeLevel) {
      newErrors.gradeLevel = 'Grade level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const result = await completeGoogleRegistration({
      googleData,
      studentId: formData.studentId,
      gradeLevel: formData.gradeLevel || null,
      role
    });

    setLoading(false);

    if (result.success) {
      if (result.status === 'pending') {
        // Admin account pending
        navigate('/admin/login', {
          state: { message: 'Your admin account is pending approval.' }
        });
      } else {
        // Student account created
        navigate('/');
      }
    }
  };

  if (!googleData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-600 to-navy-800 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-navy-700 text-white p-8 text-center">
          <div className="flex justify-center mb-2">
            <GraduationCap className="w-10 h-10 text-carolina-300" />
          </div>
          <h1 className="text-2xl font-bold">
            {t('auth.completeRegistration', 'Complete Registration')}
          </h1>
          <p className="text-carolina-200 text-sm mt-1">
            {t('auth.oneMoreStep', 'Just one more step to finish your account')}
          </p>
        </div>

        {/* Google Account Info */}
        <div className="bg-gray-50 px-8 py-4 border-b">
          <div className="flex items-center gap-3">
            {googleData.picture ? (
              <img
                src={googleData.picture}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center">
                <User className="w-6 h-6 text-navy-600" />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-800">
                {googleData.firstName} {googleData.lastName}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {googleData.email}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {/* Student/Admin ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {role === 'admin' ? (t('auth.adminId') || 'Admin ID') : t('auth.studentId')}
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder={role === 'admin' ? 'Enter your admin ID' : '123456'}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none ${errors.studentId ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
          </div>

          {/* Grade Level (Students only) */}
          {role === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.gradeLevel')}
              </label>
              <select
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none ${errors.gradeLevel ? 'border-red-500' : 'border-gray-300'} ${!formData.gradeLevel ? 'text-gray-400' : 'text-gray-800'}`}
              >
                <option value="" disabled>{t('auth.selectGrade', 'Select your grade')}</option>
                {gradeOptions.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              {errors.gradeLevel && <p className="text-red-500 text-xs mt-1">{errors.gradeLevel}</p>}
            </div>
          )}

          {/* Admin notice */}
          {role === 'admin' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              <p className="font-medium">Admin Account Notice</p>
              <p className="mt-1 text-amber-700">
                Your admin account will require approval from the site owner before you can access the admin dashboard.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-600 text-white py-3 rounded-lg font-bold hover:bg-navy-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              t('auth.completeRegistration', 'Complete Registration')
            )}
          </button>

          {/* Cancel Link */}
          <div className="text-center text-sm text-gray-600">
            <Link to="/login" className="text-navy-600 hover:underline font-medium">
              {t('common.cancel', 'Cancel')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteGoogleRegistration;
