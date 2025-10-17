import React, { useState } from 'react';
import Header from './components/Header';
import GameSelector from './components/GameSelector';
import AnalysisDisplay from './components/AnalysisDisplay';
import Modal from './components/Modal';
import LoginPage from './pages/LoginPage';
import ProfileModal from './components/ProfileModal';
import { getMatchAnalysis, getMatchesForDay } from './services/geminiService';
import type { AnalysisResult, Match } from './types';
import { useLanguage } from './contexts/LanguageContext';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isFindingMatches, setIsFindingMatches] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  const [isAnalysisModalOpen, setAnalysisModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [analysesCount, setAnalysesCount] = useState<number>(0);

  const { t, language } = useLanguage();

  const handleFindMatches = async (details: { country: string; competition: string; date: string; }) => {
    setIsFindingMatches(true);
    setError(null);
    setMatches([]);
    setAnalysisResult(null);

    try {
        const results = await getMatchesForDay({ competition: details.competition, date: details.date });
        if (results.length === 0) {
            setError(t('noMatchesError'));
        } else {
            setMatches(results);
        }
    } catch (err) {
        console.error(err);
        setError(t('findMatchesError'));
    } finally {
        setIsFindingMatches(false);
    }
  };

  const handleAnalyze = async (gameDetails: {
    country: string;
    competition: string;
    date: string;
    teamA: string;
    teamB: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setAnalysisModalOpen(true);

    try {
      const result = await getMatchAnalysis(gameDetails, language);
      setAnalysisResult(result);
      setAnalysesCount(prev => prev + 1);
    } catch (err) {
      console.error(err);
      setError(t('analysisError'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);
  
  if (!isLoggedIn) {
      return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 flex flex-col">
      <Header 
        onLogout={handleLogout}
        onViewProfile={() => setProfileModalOpen(true)}
      />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-lg text-slate-600 dark:text-slate-400 mb-8 px-2">
            {t('appSubtitle')}
          </p>
          <GameSelector 
            onFindMatches={handleFindMatches} 
            onAnalyze={handleAnalyze} 
            matches={matches}
            isFindingMatches={isFindingMatches}
            isAnalyzing={isLoading}
          />
          <div className="mt-8">
            {error && !isLoading && <div className="text-center p-4 bg-red-500/10 text-red-500 dark:text-red-400 rounded-lg animate-fade-in">{error}</div>}
          </div>
        </div>
      </main>
      
      <Footer />

      <Modal isOpen={isAnalysisModalOpen} onClose={() => setAnalysisModalOpen(false)} title={t('aiAnalysisTitle')}>
          <AnalysisDisplay result={analysisResult} loading={isLoading} error={isLoading ? null : error} />
      </Modal>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
        analysesCount={analysesCount} 
      />
    </div>
  );
};

export default App;