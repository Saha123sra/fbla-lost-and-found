import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

const StudentLogin = () => {
  const { t } = useLanguage();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!studentId || !password) {
      setError('Please enter both Student ID and password');
      return;
    }

    setLoading(true);
    const result = await login({ studentId, password, role: 'student' });
    setLoading(false);

    if (result.success) {
      navigate('/'); // Redirect to homepage
    } else {
      setError(result.error || 'Invalid Student ID or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-600 to-navy-800 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-navy-700 text-white p-8 text-center">
          <h1 className="text-2xl font-bold">{t('auth.studentLogin', 'Student Login')}</h1>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.studentId')}
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder={t('auth.enterStudentId', 'Enter your student ID')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.enterPassword', 'Enter your password')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 outline-none transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-600 text-white py-3 rounded-lg font-bold hover:bg-navy-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.loading') : t('auth.login')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{t('auth.or', 'or')}</span>
            </div>
          </div>

          {/* Google Sign-In */}
          <GoogleSignInButton
            role="student"
            onError={(err) => setError(err)}
          />

          <div className="mt-6 text-center text-sm text-gray-600">
            <Link to="/forgot-password" className="hover:underline">
              {t('auth.forgotPassword')}
            </Link>
            <span className="mx-2">|</span>
            <Link to="/register" className="hover:underline">
              {t('nav.signUp')}
            </Link>
            <span className="mx-2">|</span>
            <Link to="/admin/login" className="hover:underline">
              {t('auth.adminLogin') || 'Admin Login'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
