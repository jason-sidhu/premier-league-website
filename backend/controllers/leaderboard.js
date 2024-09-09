import express from 'express';
import UserScoreModel from '../models/UserScoreModel.js';
import User from '../models/User.js';

// const router = express.Router();
export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await UserScoreModel.find()
            .populate('userId', 'username') 
            .sort({ totalScore: -1 })  // Sort by totalScore in descending order
            .limit(100);  // Limit to top 100 users
        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Failed to fetch leaderboard' });
    }
};