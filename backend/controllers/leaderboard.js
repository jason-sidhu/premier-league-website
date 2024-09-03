// import express from 'express';
// import UserScore from '../models/UserScoreModel.js';
// import User from '../models/User.js';

// const router = express.Router();

// router.get('/leaderboard', async (req, res) => {
//     try {
//         const leaderboard = await UserScore.find()
//             .sort({ totalScore: -1 })
//             .limit(10)
//             .populate('userId', 'username')
//             .exec();

//         res.status(200).json(leaderboard.map(userScore => ({
//             userId: userScore.userId._id,
//             username: userScore.userId.username,
//             totalScore: userScore.totalScore,
//         })));
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch leaderboard' });
//     }
// });

// export default router;
