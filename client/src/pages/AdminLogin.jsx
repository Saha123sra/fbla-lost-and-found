import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Crown, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [loginType, setLoginType] = useState('owner'); // 'owner' or 'admin'
  const [email, setEmail] = useState('');
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, loginOwner } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;

    if (loginType === 'owner') {
      // Owner login - email + password only
      if (!email || !password) {
        setError('Email and password required');
        setLoading(false);
        return;
      }
      result = await loginOwner({ email, password });
    } else {
      // Admin login - Admin ID + password
      if (!adminId || !password) {
        setError('Admin ID and password required');
        setLoading(false);
        return;
      }
      result = await login({ studentId: adminId, password, role: 'admin' });
    }

    setLoading(false);

    if (result.success) {
      if (result.requiresOTP) {
        // Admin requires OTP verification
        navigate('/verify-otp', {
          state: { userId: result.userId, email: result.email, redirectTo: '/admin' }
        });
      } else {
        navigate(loginType === 'owner' ? '/owner/dashboard' : '/admin');
      }
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-navy-700 text-white p-8 text-center">
          <h1 className="text-2xl font-bold">
            {loginType === 'owner' ? 'Owner Login' : 'Admin Login'}
          </h1>
        </div>

        <div className="p-8">
          {/* Login Type Toggle */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginType('owner')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${
                loginType === 'owner'
                  ? 'bg-white text-navy-700 shadow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Crown className="w-4 h-4" />
              Site Owner
            </button>
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${
                loginType === 'admin'
                  ? 'bg-white text-navy-700 shadow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {loginType === 'owner' ? (
              /* Owner Login - Email only */
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@lostdanefound.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 outline-none transition"
                />
              </div>
            ) : (
              /* Admin Login - Admin ID */
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin ID
                </label>
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="Enter your admin ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 outline-none transition"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {loginType === 'admin' && (
              <>
                <Link to="/register/admin" className="text-navy-600 hover:underline">
                  Register as Admin
                </Link>
                <span className="mx-2">|</span>
              </>
            )}
            <Link to="/login" className="hover:underline">
              Student Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
