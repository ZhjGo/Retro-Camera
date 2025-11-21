import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../locales/en.json';
import zh from '../locales/zh.json';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('appLanguage');
    return saved || 'en';
  });
  const [translations, setTranslations] = useState(en);

  useEffect(() => {
    setTranslations(language === 'zh' ? zh : en);
  }, [language]);

  const t = (key) => {
    return translations[key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'en' ? 'zh' : 'en';
      localStorage.setItem('appLanguage', newLang);
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
