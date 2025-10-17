import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult, GroundingChunk, Match, Language } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getMatchesForDay = async (details: {
  competition: string;
  date: string;
}): Promise<Match[]> => {
    const { competition, date } = details;

    const prompt = `
    List all football (soccer) matches for the ${competition} scheduled on ${date} (Brasília Time Zone, UTC-3).
    Format your response STRICTLY as a JSON array of objects. Each object must represent a match and have three keys: "homeTeam", "awayTeam", and "time".
    
    CRUCIAL: The "time" MUST be the kickoff time converted to Brasília Time Zone (BRT, UTC-3) and formatted as HH:MM (24-hour clock).
    
    For example:
    [
      { "homeTeam": "Team A", "awayTeam": "Team B", "time": "19:00" },
      { "homeTeam": "Team C", "awayTeam": "Team D", "time": "21:45" }
    ]
    If you cannot find any matches, return an empty array [].
    VERY IMPORTANT: Do not include any text, explanation, or markdown formatting like \`\`\`json before or after the JSON array. Your response must be only the JSON.
  `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text.trim();
        if (!text.startsWith('[') || !text.endsWith(']')) {
            console.warn("AI response for matches was not a clean JSON array:", text);
            const jsonMatch = text.match(/(\[.*\])/s);
            if (jsonMatch && jsonMatch[0]) {
                 return JSON.parse(jsonMatch[0]) as Match[];
            }
            throw new Error("Response was not in the expected JSON format.");
        }
        
        return JSON.parse(text) as Match[];

    } catch (error) {
        console.error("Error parsing match data from Gemini API:", error);
        throw new Error("Failed to fetch matches. The AI may be unable to find games for the selected criteria, or the format was incorrect.");
    }
};


export const getMatchAnalysis = async (
  gameDetails: {
    country: string;
    competition: string;
    date: string;
    teamA: string;
    teamB: string;
  },
  language: Language
): Promise<AnalysisResult> => {
  const { country, competition, date, teamA, teamB } = gameDetails;
  const langMap = {
      en: 'English',
      pt: 'Portuguese (Brazil)'
  };
  
  const prompt = `
    First, determine if the football match between ${teamA} (home) and ${teamB} (away) in the ${competition} (${country}) on ${date} has already been completed.

    Your response must be STRICTLY a JSON object. Do not include any text, explanation, or markdown formatting.
    
    Case 1: The match is already FINISHED.
    Return a JSON object with this structure:
    {
      "matchStatus": "finished",
      "finalScore": "The final score, e.g., '${teamA} 3 - 1 ${teamB}'",
      "teamA": { "name": "${teamA}", "form": "Pre-match form string (W/D/L)" },
      "teamB": { "name": "${teamB}", "form": "Pre-match form string (W/D/L)" },
      "h2h": { "match": "Result of the most recent head-to-head match before this one." },
      "matchStats": {
        "shotsOnTarget": { "teamA": a number, "teamB": a number },
        "possession": { "teamA": a percentage, "teamB": a percentage },
        "corners": { "teamA": a number, "teamB": a number },
        "fouls": { "teamA": a number, "teamB": a number },
        "yellowCards": { "teamA": a number, "teamB": a number },
        "redCards": { "teamA": a number, "teamB": a number }
      }
    }

    Case 2: The match is UPCOMING (not yet finished).
    Provide a predictive analysis for sports betting in ${langMap[language]}. Fetch data for the last 5 official games for each team and the most recent head-to-head (H2H) match.
    
    IMPORTANT: If the most recent H2H match is too old (e.g., played more than 2 years ago) or lacks sufficient statistical data to be relevant, you MUST base your predictive analysis solely on the recent form and stats of the teams (last 5 games). In such cases, the "h2h" field can contain a brief note about the lack of data (like "No recent H2H encounters"), and the "stats" sub-object under "h2h" should be omitted. The "probabilities" MUST be calculated without relying on the old H2H data.

    Return a JSON object with this structure:
    {
      "matchStatus": "upcoming",
      "teamA": {
        "name": "${teamA}",
        "form": "Last 5 matches (e.g., 'W-D-L-W-W')",
        "avgGoalsScored": a number, "avgGoalsConceded": a number, "avgCorners": a number, "avgYellowCards": a number, "avgRedCards": a number, "avgFouls": a number, "avgShots": a number
      },
      "teamB": {
        "name": "${teamB}",
        "form": "Last 5 matches (e.g., 'L-D-W-W-D')",
        "avgGoalsScored": a number, "avgGoalsConceded": a number, "avgCorners": a number, "avgYellowCards": a number, "avgRedCards": a number, "avgFouls": a number, "avgShots": a number
      },
      "h2h": {
        "match": "Most recent H2H result string, or a note if no relevant H2H exists.",
        "stats": { "shotsOnTarget": { "teamA": a number, "teamB": a number }, "possession": { "teamA": a percentage, "teamB": a percentage }, "corners": { "teamA": a number, "teamB": a number }, "fouls": { "teamA": a number, "teamB": a number }, "yellowCards": { "teamA": a number, "teamB": a number }, "redCards": { "teamA": a number, "teamB": a number } }
      },
      "probabilities": {
        "matchWinner": { "homeWin": percentage, "draw": percentage, "awayWin": percentage },
        "overUnder25": { "over": percentage, "under": percentage },
        "btts": { "yes": percentage, "no": percentage },
        "doubleChance": { "homeOrDraw": percentage, "awayOrDraw": percentage, "homeOrAway": percentage },
        "drawNoBet": { "homeWin": percentage, "awayWin": percentage },
        "overUnderGoals": { "over15": percentage, "under15": percentage, "over35": percentage, "under35": percentage },
        "resultAndOver25": { "homeAndOver": percentage, "homeAndUnder": percentage, "awayAndOver": percentage, "awayAndUnder": percentage },
        "asianHandicap": { "homeMinus15": percentage, "awayPlus15": percentage },
        "correctScore": [ { "score": "1-0", "probability": percentage }, { "score": "2-1", "probability": percentage }, { "score": "1-1", "probability": percentage } ],
        "firstTeamToScore": { "home": percentage, "away": percentage, "none": percentage },
        "htft": { "homeHome": percentage, "homeDraw": percentage, "homeAway": percentage, "drawHome": percentage, "drawDraw": percentage, "drawAway": percentage, "awayHome": percentage, "awayDraw": percentage, "awayAway": percentage },
        "cornersOverUnder95": { "over": percentage, "under": percentage },
        "cardsOverUnder45": { "over": percentage, "under": percentage },
        "playerProps": {
          "shotsOnTargetOver05": { "playerName": "player with highest chance", "probability": percentage },
          "scoreAnytime": { "playerName": "player with highest chance", "probability": percentage },
          "assistAnytime": { "playerName": "player with highest chance", "probability": percentage }
        }
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    const text = response.text.trim();
    
    let analysisData;
    try {
        // Find the start and end of the JSON object to handle cases where it's wrapped in markdown
        const startIndex = text.indexOf('{');
        const endIndex = text.lastIndexOf('}');
        if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
            console.error("No valid JSON object found in response:", text);
            throw new Error("AI returned malformed data. Please try again.");
        }
        const jsonString = text.substring(startIndex, endIndex + 1);
        analysisData = JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON response:", text, e);
        throw new Error("AI returned malformed data. Please try again.");
    }

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingChunk[] = groundingMetadata?.groundingChunks || [];

    // Basic validation
    if (!analysisData.teamA || !analysisData.matchStatus) {
        throw new Error("Received incomplete analysis from the AI model.");
    }
    
    return { ...analysisData, sources };

  } catch (error) {
    console.error("Error calling Gemini API for analysis:", error);
    if (error instanceof Error && (error.message.includes("malformed") || error.message.includes("did not contain a valid JSON"))) {
        throw error;
    }
    throw new Error("Failed to generate match analysis from Gemini API.");
  }
};