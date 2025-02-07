// import express from 'express';
// import UserScoreModel from '../models/UserScoreModel.js';
// import User from '../models/User.js';

// // const router = express.Router();
// export const getLeaderboard = async (req, res) => {
//     try {
//         const leaderboard = await UserScoreModel.find()
//             .populate('userId', 'username') 
//             .sort({ totalScore: -1 })  // Sort by totalScore in descending order
//             .limit(100);  // Limit to top 100 users
//         res.json(leaderboard);
//     } catch (error) {
//         console.error('Error fetching leaderboard:', error);
//         res.status(500).json({ message: 'Failed to fetch leaderboard' });
//     }
// };


// USE TO UPDATE SCORES. TAKES LONG TO LOAD, 
//*******DO NOT PUSH CHANGE *********/
import UserScoreModel from '../models/UserScoreModel.js';
import User from '../models/User.js';
import MatchResult from '../models/MatchResultModel.js'; // Assuming this is where match results are stored
import PredictionModel from '../models/PredictionModel.js'; // Assuming this stores user predictions
import { calculateScore } from "./predictions.js"; // Reuse your existing score calculation logic

export const getLeaderboard = async (req, res) => {
    try {
        const allUsers = await User.find(); // Fetch all users

        // Iterate through each user to check if any scores are missing for finished game weeks
        for (const user of allUsers) {
            let userScore = await UserScoreModel.findOne({ userId: user._id });

            // If userScore doesn't exist, initialize it
            if (!userScore) {
                userScore = new UserScoreModel({ userId: user._id, totalScore: 0, gameWeekScores: [] });
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
                        const prediction = await PredictionModel.findOne({ userId: user._id, matchId: matchResult.matchId });

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
        }

        // Fetch the leaderboard (after all scores have been calculated)
        const leaderboard = await UserScoreModel.find()
            .populate('userId', 'username') 
            .sort({ totalScore: -1 })  // Sort by totalScore in descending order
            .limit(100);  // Limit to top 100 users

        // Filter out entries where userId is null (deleted users)
        const filteredLeaderboard = leaderboard.filter(entry => entry.userId);

        res.json(filteredLeaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Failed to fetch leaderboard' });
    }
};
