export type Language = 'en' | 'pt';

// FIX: Made the `web` property optional. The GroundingChunk from the Gemini API may not always include it, so this change aligns our local type with the API response and prevents a type error.
export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

// New types for structured analysis
export interface TeamStats {
    name: string;
    form: string; // e.g., 'W-D-L-W-W'
    avgGoalsScored: number;
    avgGoalsConceded: number;
    avgCorners: number;
    avgYellowCards: number;
    avgRedCards: number;
    avgFouls: number;
    avgShots: number;
}

export interface MatchStats {
    shotsOnTarget: { teamA: number; teamB: number };
    possession: { teamA: number; teamB: number }; // in percentage
    corners: { teamA: number; teamB: number };
    fouls: { teamA: number; teamB: number };
    yellowCards: { teamA: number; teamB: number };
    redCards: { teamA: number; teamB: number };
}


export interface H2HResult {
    match: string; // e.g., 'Team A 2 - 1 Team B (2023-10-25)'
    stats?: MatchStats;
}

export interface PlayerProp {
  playerName: string;
  probability: number;
}

export interface Probabilities {
    matchWinner: {
        homeWin: number; // percentage
        draw: number;
        awayWin: number;
    };
    overUnder25: {
        over: number;
        under: number;
    };
    btts: { // Both Teams To Score
        yes: number;
        no: number;
    };
    doubleChance: {
        homeOrDraw: number;
        awayOrDraw: number;
        homeOrAway: number;
    };
    drawNoBet: {
        homeWin: number;
        awayWin: number;
    };
    overUnderGoals: {
        over15: number;
        under15: number;
        over35: number;
        under35: number;

    };
    resultAndOver25: {
        homeAndOver: number;
        homeAndUnder: number;
        awayAndOver: number;
        awayAndUnder: number;
    };
    asianHandicap: {
        homeMinus15: number;
        awayPlus15: number;
    };
    correctScore: Array<{
        score: string;
        probability: number;
    }>;
    firstTeamToScore: {
        home: number;
        away: number;
        none: number;
    };
    htft: {
        homeHome: number;
        homeDraw: number;
        homeAway: number;
        drawHome: number;
        drawDraw: number;
        drawAway: number;
        awayHome: number;
        awayDraw: number;
        awayAway: number;
    };
    cornersOverUnder95: {
        over: number;
        under: number;
    };
    cardsOverUnder45: {
        over: number;
        under: number;
    };
    playerProps?: {
        shotsOnTargetOver05?: PlayerProp;
        scoreAnytime?: PlayerProp;
        assistAnytime?: PlayerProp;
    };
}

export interface AnalysisResult {
  matchStatus: 'upcoming' | 'finished';
  teamA: TeamStats;
  teamB: TeamStats;
  h2h: H2HResult;
  sources: GroundingChunk[];
  // For upcoming matches
  probabilities?: Probabilities;
  // For finished matches
  finalScore?: string;
  matchStats?: MatchStats;
}


export interface Competition {
  name: string;
  country: string;
}

export interface Country {
  key: string;
  competitions: string[];
}

export interface Match {
  homeTeam: string;
  awayTeam: string;
  time?: string;
}