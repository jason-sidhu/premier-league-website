import express from "express"; 
import { getProfile, updateProfile, deleteProfile } from "../controllers/profile.js";
import { verifyToken } from "../middleware/auth.js"; 

const router = express.Router(); 

//read routes 
//use our verify token from auth and then get profile (next)
router.get("/", verifyToken, getProfile); 
router.patch("/update", verifyToken, updateProfile); 
router.delete("/delete", verifyToken, deleteProfile);



export default router; 



