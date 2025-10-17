import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Language = 'en' | 'pt';
// Use a generic object type for translations loaded dynamically from JSON.
type Translations = { [key: string]: string };

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang as Language) || 'pt';
  });
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    localStorage.setItem('language', language);
    // Fetch the translation file when the language changes.
    // The path `./locales/...` is relative to the current directory.
    fetch(`./locales/${language}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setTranslations(data);
      })
      .catch(error => {
        console.error("Could not load translation file:", error);
        setTranslations({}); // Clear translations on error to avoid stale data.
      });
  }, [language]);

  const t = (key: string): string => {
    return translations[key] || key;
  };

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