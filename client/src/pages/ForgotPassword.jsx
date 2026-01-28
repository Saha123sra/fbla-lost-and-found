import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devResetLink, setDevResetLink] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      setSubmitted(true);

      // In dev mode, the API returns the reset link directly
      if (response.data.devResetLink) {
        setDevResetLink(response.data.devResetLink);
        toast.success('Dev mode: Reset link generated');
      } else {
        toast.success('Check your email for reset instructions');
      }
    } catch (error) {
      // Still show success to prevent email enumeration
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="bg-green-600 text-white p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">
              {devResetLink ? 'Reset Link Generated' : 'Check Your Email'}
            </h1>
          </div>

          <div className="p-8 text-center">
            {devResetLink ? (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm font-medium mb-2">
                    ⚠️ Dev Mode - Email not configured
                  </p>
                  <p className="text-yellow-700 text-xs">
                    Click the link below to reset your password:
                  </p>
                </div>

                <Link
                  to={devResetLink.replace('http://localhost:3000', '')}
                  className="block w-full bg-navy-600 text-white py-3 rounded-lg font-bold hover:bg-navy-700 transition text-center mb-4"
                >
                  Reset Password Now
                </Link>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  If an account exists with <strong>{email}</strong>, we've sent password reset instructions to that address.
                </p>

                <p className="text-gray-500 text-sm mb-6">
                  Didn't receive the email? Check your spam folder or try again in a few minutes.
                </p>
              </>
            )}

            <div className="space-y-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                  setDevResetLink(null);
                }}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Try Another Email
              </button>

              <Link
                to="/login"
                className="block w-full bg-navy-600 text-white py-3 rounded-lg font-bold hover:bg-navy-700 transition text-center"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-navy-700 text-white p-8 text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 text-carolina" />
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p className="text-navy-200 mt-2">No worries, we'll send you reset instructions.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 outline-none transition"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-600 text-white py-3 rounded-lg font-bold hover:bg-navy-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-navy-600 hover:underline inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
