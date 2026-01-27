import React, { createContext, useContext, useState, useEffect } from 'react';

// Import translations
import en from '../translations/en';
import es from '../translations/es';
import hi from '../translations/hi';
import fr from '../translations/fr';

const translations = { en, es, hi, fr };

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper function to get nested translation value
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

export const LanguageProvider = ({ children }) => {
  // Get saved language from localStorage or default to English
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved && translations[saved] ? saved : 'en';
  });

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key, fallback = '') => {
    const translation = getNestedValue(translations[language], key);
    if (translation !== null) {
      return translation;
    }
    // Fallback to English if key not found in current language
    const englishFallback = getNestedValue(translations.en, key);
    if (englishFallback !== null) {
      return englishFallback;
    }
    // Return fallback or key if nothing found
    return fallback || key;
  };

  // Available languages with their display names and flags
  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिंदी' },
    { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' }
  ];

  const value = {
    language,
    setLanguage,
    t,
    availableLanguages,
    currentLanguage: availableLanguages.find(l => l.code === language)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
