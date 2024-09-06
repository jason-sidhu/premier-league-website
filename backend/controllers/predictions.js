import PredictionModel from "../models/PredictionModel.js";
import MatchResult from "../models/MatchResultModel.js";
import UserScoreModel from "../models/UserScoreModel.js";

export const savePrediction = async (req, res) => {
    const { matchId, gameWeek, team1Score, team2Score } = req.body;
    const userId = req.user?.id; // Extract userId from the token

    // If userId is not present, return an error
    if (!userId) {
        return res.status(401).json({ message: 'User ID not found. Unauthorized access.' });
    }

    try {
        // Check if the match is already completed
        const matchResult = await MatchResult.findOne({ matchId });

        if (matchResult && matchResult.completed) {
            return res.status(400).json({ message: 'Cannot update prediction for a completed match' });
        }

        // Save or update the prediction
        const prediction = await PredictionModel.findOneAndUpdate(
            { userId, matchId },
            { gameWeek, team1Score, team2Score, matchResultId: matchResult ? matchResult._id : null },
            { new: true, upsert: true } // Upsert will create the prediction if it doesn't exist
        );

        console.log('Prediction saved successfully:', prediction);
        res.json({ message: 'Prediction saved successfully', prediction });
    } catch (error) {
        console.error('Error saving prediction:', error);
        res.status(500).json({ error: 'Failed to save prediction' });
    }
};


export const getPrediction = async (req, res) => {
    const { gameWeek } = req.query;
    const userId = req.user?.id; // Extract userId from the token

    // If userId is not present, return an error
    if (!userId) {
        return res.status(401).json({ message: 'User ID not found. Unauthorized access.' });
    }

    try {
        console.log(`Fetching predictions for userId: ${userId}, gameWeek: ${gameWeek}`);

        // Fetch all predictions for the game week
        const predictions = await PredictionModel.find({ userId, gameWeek });

        console.log(`Predictions found for gameWeek ${gameWeek}:`, predictions);

        // Send back the array of predictions
        res.status(200).json(predictions);
    } catch (error) {
        console.error(`Error fetching predictions for userId ${userId} and gameWeek ${gameWeek}:`, error);
        res.status(500).json({ error: 'Failed to fetch predictions' });
    }
};



//scoring predictions 

//helper
function calculateScore(prediction, actualResult) {
    let score = 0;

    const { team1Score: predictedTeam1, team2Score: predictedTeam2 } = prediction;
    const { team1Score: actualTeam1, team2Score: actualTeam2 } = actualResult;

    // Determine the outcome (win/lose/draw)
    const predictedOutcome = getOutcome(predictedTeam1, predictedTeam2);
    const actualOutcome = getOutcome(actualTeam1, actualTeam2);

    // 3 points for correct outcome (win/lose/draw)
    if (predictedOutcome === actualOutcome) {
        score += 3;
    } else {
        return score;  // No points for goal difference if the outcome is wrong
    }

    // 5 points for correct Team 1 score
    if (predictedTeam1 === actualTeam1) {
        score += 5;
    }

    // 5 points for correct Team 2 score
    if (predictedTeam2 === actualTeam2) {
        score += 5;
    }

    // 1 point for correct goal difference, only if the outcome is correct
    const predictedGoalDifference = predictedTeam1 - predictedTeam2;
    const actualGoalDifference = actualTeam1 - actualTeam2;
    if (predictedGoalDifference === actualGoalDifference) {
        score += 1;
    }

    return score;
}

function getOutcome(team1Score, team2Score) {
    if (team1Score > team2Score) return 'win';
    if (team1Score < team2Score) return 'lose';
    return 'draw';
}


export const getGameWeekScore = async (req, res) => {
    const { gameWeek } = req.query;
    const userId = req.user.id; // Extract userId from the token

    try {
        let userScore = await UserScoreModel.findOne({ userId });

        // If userScore doesn't exist, initialize it
        if (!userScore) {
            userScore = new UserScoreModel({ userId, totalScore: 0, gameWeekScores: [] });
        }

        // Fetch all finished game weeks
        const finishedGameWeeks = await MatchResult.distinct('gameWeek', { completed: true });

        let updatedTotalScore = userScore.totalScore;

        // Calculate scores for any finished game weeks that haven't been scored yet
        for (const finishedWeek of finishedGameWeeks) {
            let existingGameWeekScore = userScore.gameWeekScores.find(score => score.gameWeek === finishedWeek);

            if (!existingGameWeekScore) {
                const matchResults = await MatchResult.find({ gameWeek: finishedWeek });
                let gameWeekTotalScore = 0;

                for (const matchResult of matchResults) {
                    const prediction = await PredictionModel.findOne({ userId, matchId: matchResult.matchId });

                    if (prediction) {
                        const score = calculateScore(prediction, matchResult);
                        gameWeekTotalScore += score;
                    }
                }

                // Add the new game week score to the user's record
                existingGameWeekScore = { gameWeek: finishedWeek, score: gameWeekTotalScore };
                userScore.gameWeekScores.push(existingGameWeekScore);
                updatedTotalScore += gameWeekTotalScore;
            }
        }

        // Update the total score in the userScore model
        userScore.totalScore = updatedTotalScore;
        await userScore.save();

        // Fetch the requested game week's score
        const gameWeekScore = userScore.gameWeekScores.find(score => score.gameWeek === parseInt(gameWeek, 10));

        res.status(200).json({ gameWeekScore: gameWeekScore ? gameWeekScore.score : 0, totalScore: userScore.totalScore });
    } catch (error) {
        console.error(`Error fetching game week score for userId ${userId} and gameWeek ${gameWeek}:`, error);
        res.status(500).json({ error: 'Failed to fetch game week score' });
    }
};



export const getSeasonScore = async (req, res) => {

};
