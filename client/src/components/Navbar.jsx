import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, HelpCircle, Search, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import TextToSpeech from './TextToSpeech';
import ThemeSwitcher from './ThemeSwitcher';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, isOwner, logout } = useAuth();
  const { t, language } = useLanguage();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Use compact styling for languages with longer text
  const isVeryCompact = language === 'es'; // Spanish needs smallest
  const isCompact = language === 'fr'; // French medium compact
  const isSemiCompact = language === 'hi'; // Hindi just needs tighter spacing
  const textSize = isVeryCompact ? 'text-xs' : (isCompact ? 'text-[13px]' : 'text-sm');
  const navSpacing = isVeryCompact ? 'space-x-5' : ((isCompact || isSemiCompact) ? 'space-x-6' : 'space-x-8');
  const iconSize = (isVeryCompact || isCompact) ? 'w-3 h-3' : 'w-4 h-4';
  const needsXLBreakpoint = isVeryCompact || isCompact || isSemiCompact;

  return (
    <nav className="bg-navy-800 text-white shadow-lg sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className={`flex items-center ${needsXLBreakpoint ? 'space-x-1' : 'space-x-2'} hover:opacity-90 transition flex-shrink-0 ml-4`}>
            <img
              src={logo}
              alt="Lost Dane Found Logo"
              className={`${isVeryCompact ? 'w-8 h-8' : 'w-10 h-10'} object-cover rounded-full border-2 border-carolina-400`}
            />
            <span className={`font-bold ${isVeryCompact ? 'text-sm' : 'text-lg'} hidden lg:inline whitespace-nowrap`}>Lost Dane Found</span>
          </Link>

          {/* Desktop Navigation - evenly spaced */}
          <div className={`${needsXLBreakpoint ? 'hidden xl:flex' : 'hidden lg:flex'} items-center justify-center flex-1 ${navSpacing} ${textSize}`}>
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
                  <Search className={iconSize} />
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
              <HelpCircle className={iconSize} />
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
                <Crown className={`${iconSize} text-yellow-300`} />
                {t('nav.owner')}
              </Link>
            )}
          </div>

          {/* Right side - TTS, Theme, Language & Login/Signup */}
          <div className={`${needsXLBreakpoint ? 'hidden xl:flex' : 'hidden lg:flex'} items-center ${needsXLBreakpoint ? 'space-x-2' : 'space-x-3'} flex-shrink-0`}>
            <TextToSpeech />
            <ThemeSwitcher />
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className={`text-carolina-300 ${textSize} whitespace-nowrap`}>{user?.name?.split(' ')[0]}</span>
                <button
                  onClick={logout}
                  className="flex items-center hover:text-carolina-300 transition p-1"
                  title={t('nav.logout')}
                  aria-label={t('nav.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`hover:text-carolina-300 transition ${textSize} whitespace-nowrap`}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register/student"
                  className={`bg-carolina-400 text-navy-900 ${isVeryCompact ? 'px-2 py-1' : 'px-3 py-1.5'} rounded-lg font-medium hover:bg-carolina-300 transition ${textSize} whitespace-nowrap`}
                >
                  {t('nav.signUp')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={`${needsXLBreakpoint ? 'xl:hidden' : 'lg:hidden'} p-2`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={`${needsXLBreakpoint ? 'xl:hidden' : 'lg:hidden'} pb-4 border-t border-navy-700 mt-2 pt-4 space-y-2`}>
            {/* TTS, Theme and Language Switcher for Mobile */}
            <div className="px-2 pb-2 border-b border-navy-700 mb-2 flex items-center gap-3">
              <TextToSpeech />
              <ThemeSwitcher />
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
