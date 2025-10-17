import React from 'react';
import { UserIcon } from './icons/UserIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  onLogout: () => void;
  onViewProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onViewProfile }) => {
  const { t } = useLanguage();

  return (
    <header className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm shadow-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-slate-800 dark:text-white">
              Goat<span className="text-green-500">Score</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageToggle />
            <ThemeToggle />
            <button
              onClick={onViewProfile}
              className="flex items-center gap-2 p-1.5 md:p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-green-500 transition-colors"
              aria-label={t('viewProfileButton')}
            >
              <UserIcon className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 p-1.5 md:p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-green-500 transition-colors"
              aria-label={t('logoutButton')}
            >
               <LogoutIcon className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;