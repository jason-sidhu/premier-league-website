import axios from "axios";
import MatchResult from "../models/MatchResultModel.js";
import { teamMapping } from "../Mapping.js";

const checkIfGameWeekCompleted = async (gameWeek) => {
    const matchResults = await MatchResult.find({ gameWeek });
    return matchResults.length > 0 && matchResults.every(match => match.completed);
};

const determineIfMatchStarted = (fixture) => {
    //simple cases to see if match has started
    if (fixture.minutes > 0 || fixture.team_h_score !== null || fixture.team_a_score !== null || (fixture.stats && fixture.stats.length > 0)) {
        return true;
    }

    //check if match started using time
    const currentTime = new Date();
    const kickoffTime = new Date(fixture.kickoff_time);
    return currentTime >= kickoffTime;
};

export const getMatches = async (req, res) => {
    try {
        const gameWeek = parseInt(req.query.gameWeek, 10);
        console.log(`Fetching matches for gameweek: ${gameWeek}`);

        // Check if the game week is already marked as completed in the database
        // added to avoid fetching from external api if we already stored gameweek data
        const gameWeekCompleted = await checkIfGameWeekCompleted(gameWeek);

        if (gameWeekCompleted) {
            // Fetch matches from the database if the game week is completed
            const matchResults = await MatchResult.find({ gameWeek });

            const formattedMatches = matchResults.map((matchResult) => ({
                matchId: matchResult.matchId,
                gameWeek: matchResult.gameWeek,
                team1: teamMapping[matchResult.team1], 
                team2: teamMapping[matchResult.team2],
                team1Score: matchResult.team1Score,
                team2Score: matchResult.team2Score,
                team1Flag: `../team-logos${fixture.team_h}.svg`,
                team2Flag: `../team-logos${fixture.team_a}.svg`,
                finished: matchResult.completed,
                started: true, 
                kickoffTime: matchResult.kickoffTime, 
            }));

            return res.json({ gameWeekCompleted: true, matches: formattedMatches });
        }

        // Fetch matches from the external API if the game week is not completed
        const response = await axios.get('https://fantasy.premierleague.com/api/fixtures/');
        const fixtures = response.data.filter(fixture => fixture.event === gameWeek);

        const formattedMatches = await Promise.all(fixtures.map(async (fixture) => {
            const matchResult = await MatchResult.findOne({ matchId: fixture.id });

            const started = determineIfMatchStarted(fixture);

            if (matchResult && matchResult.completed) {
                // If the match is already recorded as completed, use existing data
                return {
                    matchId: fixture.id,
                    gameWeek: gameWeek,
                    team1: teamMapping[fixture.team_h],
                    team2: teamMapping[fixture.team_a],
                    team1Score: matchResult.team1Score,
                    team2Score: matchResult.team2Score,
                    team1Flag: `../team-logos${fixture.team_h}.svg`,
                    team2Flag: `../team-logos${fixture.team_a}.svg`,
                    finished: matchResult.completed,
                    started: true,
                    kickoffTime: fixture.kickoff_time
                };
            } else if (fixture.finished) {
                // If the match is finished but not yet recorded, update the database
                await MatchResult.updateOne({ matchId: fixture.id }, {
                    $set: {
                        gameWeek: gameWeek,
                        team1Score: fixture.team_h_score,
                        team2Score: fixture.team_a_score,
                        completed: fixture.finished
                    }
                }, { upsert: true });

                return {
                    matchId: fixture.id,
                    gameWeek: gameWeek,
                    team1: teamMapping[fixture.team_h],
                    team2: teamMapping[fixture.team_a],
                    team1Score: fixture.team_h_score,
                    team2Score: fixture.team_a_score,
                    team1Flag: `../team-logos${fixture.team_h}.svg`,
                    team2Flag: `../team-logos${fixture.team_a}.svg`,
                    finished: fixture.finished,
                    started: true,
                    kickoffTime: fixture.kickoff_time
                };
            } else {
                // If the match is not finished, return the current state with the started status
                return {
                    matchId: fixture.id,
                    gameWeek: gameWeek,
                    team1: teamMapping[fixture.team_h],
                    team2: teamMapping[fixture.team_a],
                    team1Flag: `../team-logos${fixture.team_h}.svg`,
                    team2Flag: `../team-logos${fixture.team_a}.svg`,
                    team1Score: null,
                    team2Score: null,
                    finished: fixture.finished,
                    started: started,
                    kickoffTime: fixture.kickoff_time
                };
            }
        }));

        // After processing all matches, check if the entire game week is complete
        gameWeekCompleted = formattedMatches.every(match => match.finished);

        // Return the matches along with the game week completion status
        res.json({ gameWeekCompleted, matches: formattedMatches });
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ error: 'Failed to fetch matches' });
    }
};
