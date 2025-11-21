import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="fixed top-8 right-8 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all text-stone-700 font-['Patrick_Hand'] flex items-center gap-2"
            title={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
        >
            <Globe size={20} />
            <span className="text-lg font-bold">{language === 'en' ? 'CN' : 'EN'}</span>
        </button>
    );
};

export default LanguageSwitcher;
