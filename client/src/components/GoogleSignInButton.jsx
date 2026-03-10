import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const GoogleSignInButton = ({ role = 'student', onError }) => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const result = await loginWithGoogle(credentialResponse.credential, role);

      if (result.success) {
        if (result.requiresOTP) {
          // Admin needs OTP verification
          navigate('/verify-otp', {
            state: {
              userId: result.userId,
              email: result.email,
              redirectTo: role === 'admin' ? '/admin' : '/',
              devMode: result.devMode,
              devOTP: result.devOTP
            }
          });
        } else if (result.requiresRegistration) {
          // New user needs to complete registration
          navigate('/complete-google-registration', {
            state: {
              googleData: result.googleData,
              role: result.role
            }
          });
        } else {
          // Successfully logged in
          navigate(role === 'admin' ? '/admin' : '/');
        }
      } else {
        if (onError) {
          onError(result.error);
        }
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (onError) {
        onError('Google sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    if (onError) {
      onError('Google sign-in failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-3">
        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme={isDark ? "filled_black" : "outline"}
        size="large"
        text="signin_with"
        shape="rectangular"
        width="100%"
        useOneTap={false}
      />
    </div>
  );
};

export default GoogleSignInButton;
