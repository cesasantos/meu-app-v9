import React, { useState, useMemo } from 'react';
import { COUNTRIES } from '../constants';
import type { Match } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ClockIcon } from './icons/ClockIcon';

interface GameSelectorProps {
  onFindMatches: (details: { country: string; competition: string; date: string; }) => void;
  onAnalyze: (details: { country:string; competition: string; date: string; teamA: string; teamB: string; }) => void;
  matches: Match[];
  isFindingMatches: boolean;
  isAnalyzing: boolean;
}

/**
 * Gets the current date string in YYYY-MM-DD format for the Brasília timezone.
 * Uses the 'en-CA' locale because it conveniently formats the date as YYYY-MM-DD,
 * which is exactly what the HTML date input element requires.
 * @returns {string} The formatted date string.
 */
const getBrasiliaDateString = (): string => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return formatter.format(now);
};


const GameSelector: React.FC<GameSelectorProps> = ({ onFindMatches, onAnalyze, matches, isFindingMatches, isAnalyzing }) => {
  const [country, setCountry] = useState(COUNTRIES[0].key);
  const [competition, setCompetition] = useState(COUNTRIES[0].competitions[0]);
  const [date, setDate] = useState(getBrasiliaDateString);
  const { t } = useLanguage();

  const competitionsForCountry = useMemo(() => {
    return COUNTRIES.find((c) => c.key === country)?.competitions || [];
  }, [country]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
    const newCompetitions = COUNTRIES.find((c) => c.key === newCountry)?.competitions || [];
    setCompetition(newCompetitions[0] || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const countryName = t(`country_${country}`);
    onFindMatches({ country: countryName, competition, date });
  };
  
  const handleMatchSelect = (match: Match) => {
    const countryName = t(`country_${country}`);
    onAnalyze({ country: countryName, competition, date, teamA: match.homeTeam, teamB: match.awayTeam });
  };

  const commonInputClasses = "w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50 transition-colors";

  return (
    <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 transition-colors">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('countryLabel')}</label>
            <select id="country" value={country} onChange={handleCountryChange} disabled={isFindingMatches || isAnalyzing} className={commonInputClasses}>
              {COUNTRIES.map((c) => (
                <option key={c.key} value={c.key}>{t(`country_${c.key}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="competition" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('competitionLabel')}</label>
            <select id="competition" value={competition} onChange={(e) => setCompetition(e.target.value)} disabled={isFindingMatches || isAnalyzing} className={commonInputClasses}>
              {competitionsForCountry.map((comp) => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('dateLabel')}</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={isFindingMatches || isAnalyzing} className={commonInputClasses} />
          </div>
        </div>
        
        <div>
          <button type="submit" disabled={isFindingMatches || isAnalyzing} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-green-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex items-center justify-center">
            {isFindingMatches ? t('findingMatchesButton') : t('findMatchesButton')}
          </button>
        </div>
      </form>

      {matches.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 text-center">{t('selectMatchTitle')}</h3>
          <div className="grid grid-cols-1 gap-4">
            {matches.map((match, index) => (
              <div key={index} className="group bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg flex items-center justify-between gap-4 border border-slate-300 dark:border-slate-600 hover:shadow-md hover:border-green-500 dark:hover:border-green-500 transition-all duration-300">
                <div>
                    {match.time && (
                        <div className="flex items-center gap-2 text-sm font-semibold text-green-500 dark:text-green-400 mb-2">
                            <ClockIcon className="h-4 w-4" />
                            <span>{match.time}</span>
                        </div>
                    )}
                    <div className="font-semibold text-lg text-slate-800 dark:text-slate-200">
                        <p>{match.homeTeam}</p>
                        <p>{match.awayTeam}</p>
                    </div>
                </div>
                <button
                  onClick={() => handleMatchSelect(match)}
                  disabled={isAnalyzing}
                  className="w-auto bg-blue-600 group-hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform group-hover:scale-105 flex-shrink-0"
                >
                  {t('analyzeButton')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSelector;