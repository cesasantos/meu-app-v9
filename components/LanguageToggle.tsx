import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'en' | 'pt');
  };

  return (
    <div className="relative">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="appearance-none w-full bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-1.5 px-3 pr-7 md:py-2 md:px-4 md:pr-8 rounded-full leading-tight focus:outline-none focus:bg-white dark:focus:bg-slate-600 focus:border-slate-500"
        aria-label="Select language"
      >
        <option value="en">EN</option>
        <option value="pt">PT</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 md:px-2 text-slate-700 dark:text-slate-300">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageToggle;