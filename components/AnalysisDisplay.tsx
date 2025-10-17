import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import type { AnalysisResult, TeamStats, Probabilities, H2HResult, MatchStats } from '../types';
import ProgressBar from './ProgressBar';
import { YellowCardIcon } from './icons/YellowCardIcon';
import { RedCardIcon } from './icons/RedCardIcon';
import { FoulIcon } from './icons/FoulIcon';
import { ShotIcon } from './icons/ShotIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface AnalysisDisplayProps {
  result: AnalysisResult | null;
  loading: boolean;
  error: string | null;
}

const loadingMessages = [
    'loadingMessage1',
    'loadingMessage2',
  'loadingMessage3',
];

const AccordionItem: React.FC<{ title: string; children: ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, children, isOpen, onToggle }) => (
  <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
    <button onClick={onToggle} className="w-full flex justify-between items-center p-3 md:p-4 text-left font-semibold text-slate-800 dark:text-slate-200 bg-slate-100/50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
      <span>{title}</span>
       <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isOpen && <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-700 animate-fade-in">{children}</div>}
  </div>
);

const ProbabilityBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="flex items-center">
        <span className="w-1/3 md:w-1/4 text-sm text-slate-600 dark:text-slate-400 truncate pr-2">{label}</span>
        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-6">
            <div
                className={`${color} h-6 rounded-full text-xs font-bold text-white flex items-center justify-center transition-all duration-500 ease-out`}
                style={{ width: `${value || 0}%` }}
            >
                {(value || 0).toFixed(0)}%
            </div>
        </div>
    </div>
);


const FormIndicator: React.FC<{ form: string }> = ({ form }) => {
    const getBubbleClass = (result: string) => {
        switch (result.toUpperCase()) {
            case 'W': return 'bg-green-500';
            case 'D': return 'bg-yellow-500';
            case 'L': return 'bg-red-500';
            default: return 'bg-slate-400';
        }
    };

    return (
        <div className="flex gap-1.5">
            {(form || '-----').split('-').map((result, index) => (
                <span key={index} className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${getBubbleClass(result)}`}>
                    {result.toUpperCase()}
                </span>
            ))}
        </div>
    );
};

const TeamStatsDisplay: React.FC<{ stats: TeamStats; t: (key: string) => string }> = ({ stats, t }) => (
    <div className="flex-1 bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
        <h4 className="text-xl font-bold text-center text-slate-800 dark:text-slate-200 mb-4 truncate">{stats.name}</h4>
        <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-600 dark:text-slate-300">{t('formLabel')}:</span>
                <FormIndicator form={stats.form} />
            </div>
            {stats.avgGoalsScored !== undefined && ( // Hide stats for finished matches if not available
            <>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{t('avgGoalsScoredLabel')}:</span>
                    <span className="font-bold text-lg text-green-500">{stats.avgGoalsScored.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{t('avgGoalsConcededLabel')}:</span>
                    <span className="font-bold text-lg text-red-500">{stats.avgGoalsConceded.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{t('avgCornersLabel')}:</span>
                    <span className="font-bold text-lg text-blue-500">{stats.avgCorners.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{t('avgShotsLabel')}:</span>
                    <div className="flex items-center gap-1">
                        <ShotIcon className="h-4 w-4 text-slate-500"/>
                        <span className="font-bold text-lg text-slate-600 dark:text-slate-300">{stats.avgShots.toFixed(1)}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{t('avgFoulsLabel')}:</span>
                    <div className="flex items-center gap-1">
                        <FoulIcon className="h-4 w-4 text-orange-500"/>
                        <span className="font-bold text-lg text-orange-500">{stats.avgFouls.toFixed(1)}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{t('avgYellowCardsLabel')}:</span>
                    <div className="flex items-center gap-1">
                        <YellowCardIcon className="h-4 w-4"/>
                        <span className="font-bold text-lg text-yellow-500">{stats.avgYellowCards.toFixed(1)}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{t('avgRedCardsLabel')}:</span>
                    <div className="flex items-center gap-1">
                        <RedCardIcon className="h-4 w-4"/>
                        <span className="font-bold text-lg text-red-500">{stats.avgRedCards.toFixed(1)}</span>
                    </div>
                </div>
            </>
            )}
        </div>
    </div>
);

const BetSlip: React.FC<{ probabilities: Probabilities; teamA: string; teamB: string; t: (key: string) => string }> = ({ probabilities, teamA, teamB, t }) => {
    const [activeTab, setActiveTab] = useState<'conservative' | 'bingo'>('conservative');
    
    const htftMapping = {
        homeHome: 'htft_HH', homeDraw: 'htft_HD', homeAway: 'htft_HA',
        drawHome: 'htft_DH', drawDraw: 'htft_DD', drawAway: 'htft_DA',
        awayHome: 'htft_AH', awayDraw: 'htft_AD', awayAway: 'htft_AA',
    };

    const conservativeBets = useMemo(() => {
        const selections = [];
        
        // Double Chance - most probable
        const dcProbs = [
            { label: t('homeOrDraw'), probability: probabilities.doubleChance.homeOrDraw },
            { label: t('awayOrDraw'), probability: probabilities.doubleChance.awayOrDraw },
            { label: t('homeOrAway'), probability: probabilities.doubleChance.homeOrAway },
        ];
        dcProbs.sort((a, b) => b.probability - a.probability);
        selections.push({
            label: dcProbs[0].label,
            market: t('doubleChanceLabel'),
            probability: dcProbs[0].probability,
        });

        // Over/Under 2.5
        selections.push(probabilities.overUnder25.over > probabilities.overUnder25.under
            ? { label: `${t('over')} 2.5`, market: t('overUnder25Label'), probability: probabilities.overUnder25.over }
            : { label: `${t('under')} 2.5`, market: t('overUnder25Label'), probability: probabilities.overUnder25.under }
        );
        
        // BTTS
        selections.push(probabilities.btts.yes > probabilities.btts.no
            ? { label: t('yes'), market: t('bttsLabel'), probability: probabilities.btts.yes }
            : { label: t('no'), market: t('bttsLabel'), probability: probabilities.btts.no }
        );
        
        return selections;
    }, [probabilities, teamA, teamB, t]);

    const bingoBets = useMemo(() => {
        const selections = [];
        const PLAYER_PROP_BINGO_THRESHOLD = 55;

        // Match Winner - most probable outcome
        const winnerProbs = [
            { label: teamA, market: t('matchResultLabel'), probability: probabilities.matchWinner.homeWin },
            { label: t('draw'), market: t('matchResultLabel'), probability: probabilities.matchWinner.draw },
            { label: teamB, market: t('matchResultLabel'), probability: probabilities.matchWinner.awayWin },
        ];
        winnerProbs.sort((a, b) => b.probability - a.probability);
        selections.push(winnerProbs[0]);
        
        // HT/FT - most probable
        const htftProbs = Object.entries(probabilities.htft).map(([key, value]) => ({ key, value }));
        htftProbs.sort((a, b) => b.value - a.value);
        if (htftProbs.length > 0) {
            const topHtftKey = htftProbs[0].key as keyof typeof htftMapping;
            selections.push({ label: t(htftMapping[topHtftKey]), market: t('htftMarket'), probability: htftProbs[0].value });
        }
        
        // Player Props - CONDITIONAL
        if (probabilities.playerProps?.scoreAnytime?.probability > PLAYER_PROP_BINGO_THRESHOLD) {
            selections.push({
                label: probabilities.playerProps.scoreAnytime.playerName,
                market: t('playerToScoreAnytimeLabel'),
                probability: probabilities.playerProps.scoreAnytime.probability,
            });
        }
        if (probabilities.playerProps?.shotsOnTargetOver05?.probability > PLAYER_PROP_BINGO_THRESHOLD) {
             selections.push({
                label: `${probabilities.playerProps.shotsOnTargetOver05.playerName}`,
                market: t('playerShotsOnTargetLabel'),
                probability: probabilities.playerProps.shotsOnTargetOver05.probability,
            });
        }

        // Corners Over/Under 9.5
        selections.push(probabilities.cornersOverUnder95.over > probabilities.cornersOverUnder95.under
            ? { label: `${t('over')} 9.5`, market: t('cornersOverUnder95Label'), probability: probabilities.cornersOverUnder95.over }
            : { label: `${t('under')} 9.5`, market: t('cornersOverUnder95Label'), probability: probabilities.cornersOverUnder95.under }
        );

        // Cards Over/Under 4.5
        selections.push(probabilities.cardsOverUnder45.over > probabilities.cardsOverUnder45.under
            ? { label: `${t('over')} 4.5`, market: t('cardsOverUnder45Label'), probability: probabilities.cardsOverUnder45.over }
            : { label: `${t('under')} 4.5`, market: t('cardsOverUnder45Label'), probability: probabilities.cardsOverUnder45.under }
        );

        return selections;
    }, [probabilities, teamA, teamB, t]);

    const renderBetList = (bets: { label: string; market: string; probability: number }[]) => (
         <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 space-y-3 animate-fade-in">
            {bets.map((bet, index) => (
                <div key={index} className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-slate-700 pb-2 last:border-b-0">
                    <span className="text-slate-600 dark:text-slate-400">{bet.market}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-right">{bet.label}</span>
                </div>
            ))}
        </div>
    );

    const commonTabClasses = "w-1/2 py-2 px-4 text-sm font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-green-500 transition-all duration-300";
    const activeTabClasses = "bg-green-600 text-white shadow";
    const inactiveTabClasses = "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600";


    return (
        <div>
            <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4 pb-1 border-b border-slate-200 dark:border-slate-700">{t('readyBetSlipTitle')}</h3>
            
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex mb-4">
                <button 
                    onClick={() => setActiveTab('conservative')}
                    className={`${commonTabClasses} ${activeTab === 'conservative' ? activeTabClasses : inactiveTabClasses}`}
                >
                    {t('conservativeSlipTitle')}
                </button>
                <button 
                    onClick={() => setActiveTab('bingo')}
                    className={`${commonTabClasses} ${activeTab === 'bingo' ? activeTabClasses : inactiveTabClasses}`}
                >
                    {t('bingoSlipTitle')}
                </button>
            </div>

            {activeTab === 'conservative' && (
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-3">{t('conservativeSlipDescription')}</p>
                    {renderBetList(conservativeBets)}
                </div>
            )}

            {activeTab === 'bingo' && (
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-3">{t('bingoSlipDescription')}</p>
                    {renderBetList(bingoBets)}
                </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center italic">{t('betSlipDisclaimer')}</p>
        </div>
    )
}

const StatsTable: React.FC<{ stats: MatchStats; t: (key: string) => string; teamA: string; teamB: string }> = ({ stats, t, teamA, teamB }) => {
    if (!stats) return null;

    const statRows = [
        { labelKey: 'h2hPossession', data: stats.possession, unit: '%' },
        { labelKey: 'h2hShotsOnTarget', data: stats.shotsOnTarget, unit: '' },
        { labelKey: 'h2hCorners', data: stats.corners, unit: '' },
        { labelKey: 'h2hFouls', data: stats.fouls, unit: '' },
        { labelKey: 'h2hYellowCards', data: stats.yellowCards, unit: '' },
        { labelKey: 'h2hRedCards', data: stats.redCards, unit: '' },
    ];

    return (
        <div className="mt-4 w-full max-w-md mx-auto">
            <h4 className="text-center font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('h2hStatsTitle')}</h4>
            <div className="space-y-1">
                {statRows.map(row => (
                    <div key={row.labelKey} className="flex justify-between items-center text-center p-2 rounded-md bg-slate-200/50 dark:bg-slate-700/50">
                        {row.data ? (
                            <>
                                <span className="w-1/4 font-bold text-lg text-blue-500">{row.data.teamA}{row.unit}</span>
                                <span className="w-1/2 text-sm font-semibold text-slate-600 dark:text-slate-400">{t(row.labelKey)}</span>
                                <span className="w-1/4 font-bold text-lg text-red-500">{row.data.teamB}{row.unit}</span>
                            </>
                        ) : (
                            <>
                                <span className="w-1/4 font-semibold text-slate-400 dark:text-slate-500">N/A</span>
                                <span className="w-1/2 text-sm font-semibold text-slate-600 dark:text-slate-400">{t(row.labelKey)}</span>
                                <span className="w-1/4 font-semibold text-slate-400 dark:text-slate-500">N/A</span>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const FinishedMatchResult: React.FC<{result: AnalysisResult; t: (key: string) => string}> = ({ result, t }) => {
    const { finalScore, matchStats, teamA, teamB } = result;

    return (
        <div>
            <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3 pb-1 border-b border-slate-200 dark:border-slate-700">{t('matchFinishedTitle')}</h3>
            <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg text-center">
                <p className="font-bold text-2xl md:text-3xl text-slate-800 dark:text-slate-200">{finalScore}</p>
                {matchStats && <StatsTable stats={matchStats} t={t} teamA={teamA.name} teamB={teamB.name} />}
            </div>
        </div>
    );
};


const AnalysisContent: React.FC<{ result: AnalysisResult, t: (key: string) => string }> = ({ result, t }) => {
    const { teamA, teamB, h2h, probabilities } = result;
    const [openAccordion, setOpenAccordion] = useState<string | null>('main');

    const handleAccordionToggle = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const htftMapping = [
        { key: 'homeHome', label: 'htft_HH' }, { key: 'homeDraw', label: 'htft_HD' }, { key: 'homeAway', label: 'htft_HA' },
        { key: 'drawHome', label: 'htft_DH' }, { key: 'drawDraw', label: 'htft_DD' }, { key: 'drawAway', label: 'htft_DA' },
        { key: 'awayHome', label: 'htft_AH' }, { key: 'awayDraw', label: 'htft_AD' }, { key: 'awayAway', label: 'htft_AA' },
    ];

    if (!probabilities) return null; // Should not happen in 'upcoming' status, but a good safeguard.

    return (
        <>
            {/* Probabilities Section */}
            <div>
                 <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4 pb-1 border-b border-slate-200 dark:border-slate-700">{t('probabilitiesTitle')}</h3>
                 <div className="space-y-3">
                    <AccordionItem title={t('mainMarketsTitle')} isOpen={openAccordion === 'main'} onToggle={() => handleAccordionToggle('main')}>
                         <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('matchResultLabel')}</h4>
                                <div className="space-y-2">
                                    <ProbabilityBar label={teamA.name} value={probabilities.matchWinner.homeWin} color="bg-blue-500" />
                                    <ProbabilityBar label={t('draw')} value={probabilities.matchWinner.draw} color="bg-yellow-500" />
                                    <ProbabilityBar label={teamB.name} value={probabilities.matchWinner.awayWin} color="bg-red-500" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('overUnder25Label')}</h4>
                                <div className="space-y-2">
                                    <ProbabilityBar label={t('over')} value={probabilities.overUnder25.over} color="bg-green-500" />
                                    <ProbabilityBar label={t('under')} value={probabilities.overUnder25.under} color="bg-slate-500" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('bttsLabel')}</h4>
                                <div className="space-y-2">
                                    <ProbabilityBar label={t('yes')} value={probabilities.btts.yes} color="bg-green-500" />
                                    <ProbabilityBar label={t('no')} value={probabilities.btts.no} color="bg-slate-500" />
                                </div>
                            </div>
                        </div>
                    </AccordionItem>

                    <AccordionItem title={t('goalMarketsTitle')} isOpen={openAccordion === 'goals'} onToggle={() => handleAccordionToggle('goals')}>
                         <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('overUnder15Label')}</h4>
                                <div className="space-y-2">
                                    <ProbabilityBar label={t('over')} value={probabilities.overUnderGoals.over15} color="bg-green-500" />
                                    <ProbabilityBar label={t('under')} value={probabilities.overUnderGoals.under15} color="bg-slate-500" />
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('overUnder35Label')}</h4>
                                <div className="space-y-2">
                                    <ProbabilityBar label={t('over')} value={probabilities.overUnderGoals.over35} color="bg-green-500" />
                                    <ProbabilityBar label={t('under')} value={probabilities.overUnderGoals.under35} color="bg-slate-500" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('firstTeamToScoreLabel')}</h4>
                                <div className="space-y-2">
                                    <ProbabilityBar label={teamA.name} value={probabilities.firstTeamToScore.home} color="bg-blue-500" />
                                    <ProbabilityBar label={teamB.name} value={probabilities.firstTeamToScore.away} color="bg-red-500" />
                                     <ProbabilityBar label={t('noGoal')} value={probabilities.firstTeamToScore.none} color="bg-slate-500" />
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('correctScoreLabel')}</h4>
                                <ul className="space-y-2 text-sm">
                                    {(probabilities.correctScore || []).map(item => (
                                    <li key={item.score} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700/50 p-2 rounded-md">
                                        <span className="font-mono text-slate-700 dark:text-slate-300">{item.score}</span>
                                        <span className="font-bold text-green-500">{item.probability.toFixed(0)}%</span>
                                    </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </AccordionItem>
                     <AccordionItem title={t('handicapAndAlternativeTitle')} isOpen={openAccordion === 'alternative'} onToggle={() => handleAccordionToggle('alternative')}>
                         <div className="space-y-6">
                             <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('doubleChanceLabel')}</h4>
                                <div className="space-y-2">
                                     <ProbabilityBar label={t('homeOrDraw')} value={probabilities.doubleChance.homeOrDraw} color="bg-cyan-500" />
                                     <ProbabilityBar label={t('awayOrDraw')} value={probabilities.doubleChance.awayOrDraw} color="bg-purple-500" />
                                     <ProbabilityBar label={t('homeOrAway')} value={probabilities.doubleChance.homeOrAway} color="bg-indigo-500" />
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('dnbLabel')}</h4>
                                <div className="space-y-2">
                                     <ProbabilityBar label={teamA.name} value={probabilities.drawNoBet.homeWin} color="bg-blue-500" />
                                     <ProbabilityBar label={teamB.name} value={probabilities.drawNoBet.awayWin} color="bg-red-500" />
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('asianHandicapLabel')}</h4>
                                <div className="space-y-2">
                                     <ProbabilityBar label={`${teamA.name} -1.5`} value={probabilities.asianHandicap.homeMinus15} color="bg-blue-500" />
                                     <ProbabilityBar label={`${teamB.name} +1.5`} value={probabilities.asianHandicap.awayPlus15} color="bg-red-500" />
                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                    <AccordionItem title={t('halfTimeTitle')} isOpen={openAccordion === 'halftime'} onToggle={() => handleAccordionToggle('halftime')}>
                         <div className="space-y-6">
                             <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('htftLabel')}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-center text-xs">
                                    {htftMapping.map(item => (
                                        <div key={item.key} className="bg-slate-100 dark:bg-slate-700/50 p-2 rounded-md">
                                            <div className="font-semibold text-slate-600 dark:text-slate-300">{t(item.label)}</div>
                                            <div className="font-bold text-lg text-green-500">
                                                {(probabilities.htft as any)[item.key]?.toFixed(0) ?? '0'}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                    <AccordionItem title={t('cardsAndCornersTitle')} isOpen={openAccordion === 'cardsCorners'} onToggle={() => handleAccordionToggle('cardsCorners')}>
                         <div className="space-y-6">
                             <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('cornersOverUnder95Label')}</h4>
                                <div className="space-y-2">
                                    <ProbabilityBar label={t('over')} value={probabilities.cornersOverUnder95.over} color="bg-green-500" />
                                    <ProbabilityBar label={t('under')} value={probabilities.cornersOverUnder95.under} color="bg-slate-500" />
                                </div>
                            </div>
                              <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('cardsOverUnder45Label')}</h4>
                                <div className="space-y-2">
                                    <ProbabilityBar label={t('over')} value={probabilities.cardsOverUnder45.over} color="bg-green-500" />
                                    <ProbabilityBar label={t('under')} value={probabilities.cardsOverUnder45.under} color="bg-slate-500" />
                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                </div>
            </div>
            
            {/* Bet Slip Section */}
            <BetSlip probabilities={probabilities} teamA={teamA.name} teamB={teamB.name} t={t} />
        </>
    );
};


const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, loading, error }) => {
    const { t } = useLanguage();
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setCurrentMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [loading]);
    
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-500 dark:text-slate-400 transition-all duration-300">
                <p className="text-lg font-semibold">{t('analyzingTitle')}</p>
                <p className="mt-2 mb-6 text-sm text-center px-4">{t(loadingMessages[currentMessageIndex])}</p>
                <div className="w-full max-w-xs">
                    <ProgressBar />
                </div>
            </div>
        );
    }

    if (error) {
         return (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-red-500 dark:text-red-400 p-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-4 text-lg font-semibold">{t('errorTitle')}</p>
                <p className="text-sm text-center">{error}</p>
            </div>
        );
    }
    
    if (result) {
        // If the match is finished, only show the result component.
        if (result.matchStatus === 'finished') {
            return (
                <div className="space-y-8">
                    <FinishedMatchResult result={result} t={t} />
                </div>
            );
        }
        
        // If the match is upcoming, show the full predictive analysis.
        if (result.matchStatus === 'upcoming' && result.probabilities) {
            const { teamA, teamB, h2h } = result;
            return (
                 <div className="space-y-8">
                    {/* Recent Form Section */}
                    <div>
                        <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4 pb-1 border-b border-slate-200 dark:border-slate-700">{t('recentFormTitle')}</h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <TeamStatsDisplay stats={teamA} t={t} />
                            <TeamStatsDisplay stats={teamB} t={t} />
                        </div>
                    </div>

                    {/* H2H Section */}
                    {h2h && h2h.match && (
                        <div>
                            <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3 pb-1 border-b border-slate-200 dark:border-slate-700">{t('headToHeadTitle')}</h3>
                            <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg text-center">
                                <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">{h2h.match}</p>
                                {h2h.stats && <StatsTable stats={h2h.stats} t={t} teamA={teamA.name} teamB={teamB.name} />}
                            </div>
                        </div>
                    )}

                    <AnalysisContent result={result} t={t} />
                </div>
            );
        }
    }

    return null;
};

export default AnalysisDisplay;