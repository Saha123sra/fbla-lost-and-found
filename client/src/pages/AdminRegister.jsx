import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Lock, User, Hash, Eye, EyeOff, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminRegister = () => {
  const { registerAdmin } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    adminId: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.adminId.trim()) newErrors.adminId = 'Admin ID is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const result = await registerAdmin({
      firstName: formData.firstName,
      lastName: formData.lastName,
      adminId: formData.adminId,
      email: formData.email,
      password: formData.password
    });

    setLoading(false);

    if (result.success) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-navy-700 text-white p-8 text-center">
          <div className="flex justify-center mb-2">
            <Shield className="w-10 h-10 text-carolina-300" />
          </div>
          <h1 className="text-2xl font-bold">Admin Registration</h1>
          <p className="text-carolina-200 text-sm mt-1">
            Lost Dane Found – Denmark High School
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Registration Submitted
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Your admin account request is <span className="font-semibold text-yellow-600">pending approval</span>.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                <h3 className="font-medium text-gray-700 mb-2">What happens next?</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>The site owner will review your request</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Once approved, you'll receive an email with your 6-digit admin access code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Use your Admin ID and password to log in</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/login/admin"
                className="block w-full bg-navy-600 text-white py-2 rounded-lg font-medium hover:bg-navy-700 transition"
              >
                Go to Admin Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Admin ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin ID</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="adminId"
                    value={formData.adminId}
                    onChange={handleChange}
                    placeholder="ADM001"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none ${errors.adminId ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.adminId && <p className="text-red-500 text-xs mt-1">{errors.adminId}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@forsyth.k12.ga.us"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy-600 text-white py-3 rounded-lg font-bold hover:bg-navy-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Create Admin Account'
                )}
              </button>

              {/* Links */}
              <div className="text-center text-sm text-gray-600">
                <p>
                  Already have an account?{' '}
                  <Link to="/login/admin" className="text-navy-600 hover:underline font-medium">
                    Admin Login
                  </Link>
                </p>
              </div>
            </form>
          )}

          <p className="text-xs text-gray-500 text-center mt-6">
            Admin accounts require manual approval by the site owner
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
