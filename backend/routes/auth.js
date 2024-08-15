import express from "express"; 
import { login } from "../controllers/auth.js"; 
import { register } from "../controllers/auth.js"; 

//router
const router = express.Router(); 


//defining routes on router 
//call this api to register, auth reg is the api path, register is the controller (logic of the endpoint)
/* auth/... */ 
router.post("/register", register); 
router.post("/login", login); 


export default login; 