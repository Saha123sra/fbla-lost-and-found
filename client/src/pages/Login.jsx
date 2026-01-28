import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-navy-700 text-white p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-10 h-10 text-skyblue-300" />
          </div>
          <h1 className="text-2xl font-bold">Lost Dane Found</h1>
          <p className="text-skyblue-200 text-sm mt-1">Denmark High School</p>
        </div>

        {/* Role selection */}
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{t('auth.selectRole', 'Select your role')}</h2>

          <div className="flex flex-col gap-4">
            {/* Student */}
            <button
              onClick={() => navigate('/login/student')}
              className="flex items-center justify-center gap-2 w-full bg-navy-600 text-white py-3 rounded-lg font-bold hover:bg-navy-700 transition"
            >
              <User className="w-5 h-5" />
              {t('auth.student', 'Student')}
            </button>

            {/* Admin */}
            <button
              onClick={() => navigate('/login/admin')}
              className="flex items-center justify-center gap-2 w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-900 transition"
            >
              <Lock className="w-5 h-5" />
              {t('nav.admin')}
            </button>
          </div>

          <p className="text-gray-600 text-sm mt-6">
            {t('auth.noAccount')}{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-navy-600 hover:text-navy-700 font-medium cursor-pointer"
            >
              {t('nav.signUp')}
            </span>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            <span
              onClick={() => navigate('/forgot-password')}
              className="text-navy-600 hover:text-navy-700 cursor-pointer hover:underline"
            >
              {t('auth.forgotPassword', 'Forgot Password?')}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
