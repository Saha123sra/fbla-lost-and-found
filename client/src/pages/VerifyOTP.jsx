import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Mail, RefreshCw } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { completeLogin } = useAuth();

  const { userId, email } = location.state || {};

  useEffect(() => {
    // Redirect if no userId
    if (!userId) {
      navigate('/login');
      return;
    }

    // Focus first input
    inputRefs.current[0]?.focus();
  }, [userId, navigate]);

  useEffect(() => {
    // Countdown timer for resend
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    // Focus last filled input or next empty
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOTP({ userId, otp: otpCode });
      const { user, token } = response.data;

      // Complete login via AuthContext
      completeLogin(user, token);

      toast.success(`Welcome back, ${user.name}!`);
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.error || 'Verification failed';
      toast.error(message);
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResending(true);
    try {
      await authAPI.resendOTP({ userId });
      toast.success('New verification code sent!');
      setCountdown(60); // 60 second cooldown
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error('Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  if (!userId) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-navy-700 text-white p-8 text-center">
          <div className="flex justify-center mb-2">
            <Shield className="w-10 h-10 text-carolina-300" />
          </div>
          <h1 className="text-2xl font-bold">Verify Your Identity</h1>
          <p className="text-carolina-200 text-sm mt-1">Two-Factor Authentication</p>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="flex items-center justify-center gap-2 mb-6 text-gray-600">
            <Mail className="w-5 h-5" />
            <span className="text-sm">Code sent to <strong>{email}</strong></span>
          </div>

          <form onSubmit={handleSubmit}>
            {/* OTP Input */}
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-navy-600 text-white py-3 rounded-lg font-bold hover:bg-navy-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Verify & Sign In'
              )}
            </button>
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={resending || countdown > 0}
              className="text-navy-600 hover:underline font-medium text-sm flex items-center justify-center gap-1 mx-auto disabled:text-gray-400 disabled:no-underline"
            >
              <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            The code will expire in 10 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
