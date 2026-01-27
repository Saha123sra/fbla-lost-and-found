import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, HelpCircle, Search, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, isOwner, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-navy-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition flex-shrink-0">
            <img
              src={logo}
              alt="Lost Dane Found Logo"
              className="w-10 h-10 object-cover rounded-full border-2 border-carolina-400 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            />
            <span className="font-bold text-base xl:text-lg hidden sm:inline whitespace-nowrap">Lost Dane Found</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center ml-6 space-x-4 xl:space-x-6 text-xs xl:text-sm">
            <Link
              to="/"
              className={`hover:text-carolina-300 transition py-2 whitespace-nowrap ${isActive('/') ? 'border-b-2 border-carolina-400' : ''}`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/browse"
              className={`hover:text-carolina-300 transition py-2 whitespace-nowrap ${isActive('/browse') ? 'border-b-2 border-carolina-400' : ''}`}
            >
              {t('nav.browse')}
            </Link>
            <Link
              to="/report"
              className={`hover:text-carolina-300 transition py-2 whitespace-nowrap ${isActive('/report') ? 'border-b-2 border-carolina-400' : ''}`}
            >
              {t('nav.reportFound')}
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/request"
                  className={`hover:text-carolina-300 transition py-2 flex items-center gap-1 whitespace-nowrap ${isActive('/request') ? 'border-b-2 border-carolina-400' : ''}`}
                >
                  <Search className="w-3 h-3 xl:w-4 xl:h-4" />
                  {t('nav.lostItem')}
                </Link>
                <Link
                  to="/my-claims"
                  className={`hover:text-carolina-300 transition py-2 whitespace-nowrap ${isActive('/my-claims') ? 'border-b-2 border-carolina-400' : ''}`}
                >
                  {t('nav.myClaims')}
                </Link>
              </>
            )}
            <Link
              to="/faq"
              className={`hover:text-carolina-300 transition py-2 flex items-center gap-1 whitespace-nowrap ${isActive('/faq') ? 'border-b-2 border-carolina-400' : ''}`}
            >
              <HelpCircle className="w-3 h-3 xl:w-4 xl:h-4" />
              {t('nav.faq')}
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={`hover:text-carolina-300 transition py-2 whitespace-nowrap ${location.pathname.startsWith('/admin') ? 'border-b-2 border-carolina-400' : ''}`}
              >
                {t('nav.admin')}
              </Link>
            )}
            {isOwner && (
              <Link
                to="/owner/dashboard"
                className={`hover:text-carolina-300 transition py-2 flex items-center gap-1 whitespace-nowrap ${location.pathname.startsWith('/owner') ? 'border-b-2 border-carolina-400' : ''}`}
              >
                <Crown className="w-3 h-3 xl:w-4 xl:h-4 text-yellow-300" />
                {t('nav.owner')}
              </Link>
            )}
          </div>

          {/* Right side - Language & Login/Signup */}
          <div className="hidden lg:flex items-center ml-4 space-x-3 flex-shrink-0">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-carolina-300 text-xs truncate max-w-[60px]">{user?.name?.split(' ')[0]}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-xs hover:text-carolina-300 transition"
                  title={t('nav.logout')}
                >
                  <LogOut className="w-3 h-3 xl:w-4 xl:h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-carolina-300 transition px-2 py-2 text-xs xl:text-sm whitespace-nowrap"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register/student"
                  className="bg-carolina-400 text-navy-900 px-2 py-1.5 rounded-lg font-medium hover:bg-carolina-300 transition text-xs xl:text-sm whitespace-nowrap"
                >
                  {t('nav.signUp')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-navy-700 mt-2 pt-4 space-y-2">
            {/* Language Switcher for Mobile */}
            <div className="px-2 pb-2 border-b border-navy-700 mb-2">
              <LanguageSwitcher />
            </div>
            <Link to="/" className="block py-2 px-2 hover:bg-navy-700 rounded" onClick={() => setMobileMenuOpen(false)}>{t('nav.home')}</Link>
            <Link to="/browse" className="block py-2 px-2 hover:bg-navy-700 rounded" onClick={() => setMobileMenuOpen(false)}>{t('nav.browse')}</Link>
            <Link to="/report" className="block py-2 px-2 hover:bg-navy-700 rounded" onClick={() => setMobileMenuOpen(false)}>{t('nav.reportFound')}</Link>
            <Link to="/faq" className="block py-2 px-2 hover:bg-navy-700 rounded" onClick={() => setMobileMenuOpen(false)}>{t('nav.faq')}</Link>
            {isAuthenticated ? (
              <>
                <Link to="/request" className="block py-2 px-2 hover:bg-navy-700 rounded" onClick={() => setMobileMenuOpen(false)}>{t('nav.lostItem')}</Link>
                <Link to="/my-claims" className="block py-2 px-2 hover:bg-navy-700 rounded" onClick={() => setMobileMenuOpen(false)}>{t('nav.myClaims')}</Link>
                <Link to="/my-requests" className="block py-2 px-2 hover:bg-navy-700 rounded" onClick={() => setMobileMenuOpen(false)}>{t('nav.myRequests')}</Link>
                {isAdmin && (
                  <Link to="/admin" className="block py-2 px-2 hover:bg-navy-700 rounded" onClick={() => setMobileMenuOpen(false)}>{t('nav.admin')}</Link>
                )}
                {isOwner && (
                  <Link to="/owner/dashboard" className="block py-2 px-2 hover:bg-navy-700 rounded text-yellow-300" onClick={() => setMobileMenuOpen(false)}>{t('nav.owner')}</Link>
                )}
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-left py-2 px-2 hover:bg-navy-700 rounded text-red-400">{t('nav.logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 px-2 hover:bg-navy-700 rounded" onClick={() => setMobileMenuOpen(false)}>{t('nav.login')}</Link>
                <Link to="/register/student" className="block py-2 px-2 bg-carolina-400 text-navy-900 rounded font-medium" onClick={() => setMobileMenuOpen(false)}>{t('nav.signUp')}</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
