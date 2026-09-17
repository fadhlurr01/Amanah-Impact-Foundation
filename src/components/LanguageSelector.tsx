/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Globe, Type, Sun, Moon } from 'lucide-react';
import { getTranslation } from '../translations';

interface LanguageSelectorProps {
  currentLang: string;
  onChangeLang: (lang: string) => void;
}

export default function LanguageSelector({ currentLang, onChangeLang }: LanguageSelectorProps) {
  const [fontSizeRatio, setFontSizeRatio] = useState<number>(1);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize and persist dark mode
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Adjust document font-size ratio
  const adjustFontSize = (direction: 'up' | 'down' | 'reset') => {
    let nextRatio = fontSizeRatio;
    if (direction === 'up') nextRatio = Math.min(1.2, fontSizeRatio + 0.05);
    else if (direction === 'down') nextRatio = Math.max(0.85, fontSizeRatio - 0.05);
    else nextRatio = 1;

    setFontSizeRatio(nextRatio);
    document.documentElement.style.fontSize = `${nextRatio * 100}%`;
  };

  const languages = [
    { code: 'id', label: 'Indonesian' },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'Arabic' },
    { code: 'zh', label: 'Chinese' },
    { code: 'ja', label: 'Japanese' }
  ];

  const t = (text: string) => getTranslation(text, currentLang);

  return (
    <div id="accessibility-toolbar" className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 text-xs text-gray-500">
      {/* Language Buttons */}
      <div className="flex items-center gap-1.5 mr-auto">
        <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
        <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">{t('Pilih Bahasa:')}</span>
        <div className="flex gap-1 overflow-x-auto">
          {languages.map((lang) => (
            <button
              key={lang.code}
              id={`lang-btn-${lang.code}`}
              onClick={() => onChangeLang(lang.code)}
              className={`px-2 py-1 rounded transition-all shrink-0 uppercase font-bold tracking-wider cursor-pointer ${
                currentLang === lang.code
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm'
                  : 'bg-white hover:bg-emerald-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {lang.code}
            </button>
          ))}
        </div>
      </div>

      {/* Font & Theme Adjustments */}
      <div className="flex items-center gap-2 ml-auto shrink-0 mt-2 sm:mt-0">
        {/* Toggle Dark Mode */}
        <button
          id="btn-toggle-theme"
          onClick={toggleTheme}
          className="p-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          title={t('Ubah Mode Layar (Gelap/Terang)')}
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5 text-yellow-500" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
        </button>

        {/* Accessibility scale */}
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-0.5">
          <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-tight text-gray-400 flex items-center gap-1 select-none">
            <Type className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {t('Ukuran teks:')}
          </span>
          <button
            id="font-btn-down"
            onClick={() => adjustFontSize('down')}
            className="px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold transition-all text-[11px] cursor-pointer"
            title={t('Kecilkan Teks')}
          >
            A-
          </button>
          <button
            id="font-btn-reset"
            onClick={() => adjustFontSize('reset')}
            className="px-1 py-0.5 rounded text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold transition-all text-[10px] cursor-pointer"
            title={t('Reset Ukuran')}
          >
            {t('Reset')}
          </button>
          <button
            id="font-btn-up"
            onClick={() => adjustFontSize('up')}
            className="px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold transition-all text-[11px] cursor-pointer"
            title={t('Besarkan Teks')}
          >
            A+
          </button>
        </div>
      </div>
    </div>
  );
}
