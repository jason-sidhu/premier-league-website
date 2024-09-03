import express from "express"; 
import { getPrediction, savePrediction, getGameWeekScore, getSeasonScore} from "../controllers/predictions.js"; 
import { verifyToken } from "../middleware/auth.js";
//router
const router = express.Router(); 


//defining routes on router 
//call this api to register, auth reg is the api path, register is the controller (logic of the endpoint)
/* predictions/... */ 
router.post("/save", verifyToken, savePrediction)
router.get("/get", verifyToken, getPrediction); 
router.get("/getGameWeekScore", verifyToken, getGameWeekScore);
router.get("/getSeasonScore", verifyToken, getSeasonScore);
 


export default router; 