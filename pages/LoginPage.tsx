import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };
  
  const commonInputClasses = "w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 dark:bg-slate-900 p-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center mb-6 text-slate-800 dark:text-white">
                <h1 className="text-4xl font-bold tracking-wider">
                    Goat<span className="text-green-500">Score</span>
                </h1>
            </div>
            <h2 className="text-center text-xl text-slate-600 dark:text-slate-300 mb-8">{t('loginSubtitle')}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{t('usernameLabel')}</label>
              <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className={commonInputClasses} required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{t('passwordLabel')}</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={commonInputClasses} required />
            </div>
            <div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-green-500 transition-all duration-300 ease-in-out">
                {t('loginButton')}
              </button>
            </div>
          </form>
           <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">{t('loginHint')}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;