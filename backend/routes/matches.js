import express from "express"; 
import { getMatches } from "../controllers/matches.js"; 

//router
const router = express.Router(); 


//defining routes on router 
//call this api to register, auth reg is the api path, register is the controller (logic of the endpoint)
/* auth/... */ 
router.get("/", getMatches); 
 


export default router; 