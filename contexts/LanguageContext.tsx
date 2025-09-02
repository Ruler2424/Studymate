
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { translations, Language, TranslationKey } from '../lib/translations.ts';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getInitialLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'ru' ? 'ru' : 'en';
  };
  
  const [language, setLanguage] = useState<Language>(getInitialLanguage());

  const t = useCallback((key: TranslationKey): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    try {
      for (const k of keys) {
        result = result[k];
      }
      if (result === undefined || typeof result !== 'string') {
        throw new Error(`Translation key not found: ${key}`);
      }
      return result;
    } catch (e) {
        // Fallback to English
        let fallbackResult: any = translations.en;
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
        }
        return (fallbackResult as string) || key;
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};