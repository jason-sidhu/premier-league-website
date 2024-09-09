import  express from "express";
import { getLeaderboard } from "../controllers/leaderboard.js"; 

const router = express.Router(); 

// /leaderboard
router.get("/", getLeaderboard); 

export default router; 