import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={() => {
        console.log('Theme toggle clicked, current theme:', theme);
        toggleTheme();
      }}
      className={`flex items-center justify-center p-2 rounded-lg transition text-white ${
        theme === 'dark'
          ? 'bg-yellow-500/20 hover:bg-yellow-500/30'
          : 'hover:bg-navy-700'
      }`}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-300" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
