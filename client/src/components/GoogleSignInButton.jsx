import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleSignInButton = ({ role = 'student', onError }) => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const result = await loginWithGoogle(credentialResponse.credential, role);

      if (result.success) {
        if (result.requiresOTP) {
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
          navigate('/complete-google-registration', {
            state: {
              googleData: result.googleData,
              role: result.role
            }
          });
        } else {
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
        theme="outline"
        size="large"
        text="signin_with"
        shape="rectangular"
        width="300"
        useOneTap={false}
      />
    </div>
  );
};

export default GoogleSignInButton;
