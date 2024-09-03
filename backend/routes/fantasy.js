import express from "express"; 
import { getFantasyDataGeneral, getFantasyFixtures, getFantasyPlayer } from "../controllers/fantasy.js";
import { verifyToken } from "../middleware/auth.js"; 

const router = express.Router(); 

//use our verify token from auth and then get profile (next) /fantasy/...
router.get("/general", getFantasyDataGeneral); 
router.get("/fixtures", getFantasyFixtures); 
router.get("/player/:playerId", getFantasyPlayer); 

export default router; 