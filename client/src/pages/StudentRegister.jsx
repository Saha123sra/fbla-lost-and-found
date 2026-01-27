import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Hash, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const StudentRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gradeLevel: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const gradeOptions = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.gradeLevel) newErrors.gradeLevel = 'Grade level is required';
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.endsWith('@forsythk12.org') && !formData.email.endsWith('@students.forsythk12.org') && !formData.email.endsWith('@gmail.com')) {
      newErrors.email = 'Please use your school email (@forsythk12.org)';
    }

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

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      gradeLevel: formData.gradeLevel,
      studentId: formData.studentId,
      email: formData.email,
      password: formData.password
    });

    setLoading(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-navy-700 text-white p-8 text-center">
          <div className="flex justify-center mb-2">
            <GraduationCap className="w-10 h-10 text-carolina-300" />
          </div>
          <h1 className="text-2xl font-bold">{t('auth.studentRegistration', 'Student Registration')}</h1>
          <p className="text-carolina-200 text-sm mt-1">
            Lost Dane Found – Denmark High School
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.firstName')}</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.lastName')}</label>
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

          {/* Grade Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.gradeLevel')}</label>
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

          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.studentId')}</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="123456"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none ${errors.studentId ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
          </div>

          {/* School Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@forsythk12.org"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.confirmPassword')}</label>
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
              t('auth.createAccount', 'Create Account')
            )}
          </button>

          {/* Links */}
          <div className="text-center text-sm text-gray-600 space-y-2">
            <p>
              {t('auth.hasAccount')}{' '}
              <Link to="/login/student" className="text-navy-600 hover:underline font-medium">
                {t('auth.login')}
              </Link>
            </p>
            <p>
              {t('auth.staffMember', 'Are you a staff member?')}{' '}
              <Link to="/register/admin" className="text-navy-600 hover:underline font-medium">
                {t('auth.adminRegistration', 'Admin Registration')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegister;
