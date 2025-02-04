"use client"

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { SunIcon, MoonIcon } from '@radix-ui/react-icons';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Detectar as preferências de cores do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="flex items-center justify-between p-5 mx-3 border-b dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all duration-300 ease-in-out">
          LS Services
        </span>
      </div>
      <div className="flex items-center">
        <SunIcon className="h-5 w-5 text-yellow-500 dark:text-gray-400" />
        <Switch
          checked={isDarkMode}
          onCheckedChange={toggleDarkMode}
          className="mx-2"
        >
          <span className="sr-only">Toggle Dark Mode</span>
          <div className="w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded-full relative">
            <div
              className={`w-4 h-4 bg-white dark:bg-gray-800 rounded-full shadow-md transform transition-transform ${
                isDarkMode ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </Switch>
        <MoonIcon className="h-5 w-5 text-gray-400 dark:text-yellow-500" />
      </div>
    </header>
  );
};

export default Header;