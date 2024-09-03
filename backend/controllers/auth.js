/*CONTROLLER FOR AUTH */
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken"; 
import User from "../models/User.js"; 

//register user 
export const register = async(req, res) => {
    try{
        //receiving from the front end req body
        const{
            firstName, 
            lastName, 
            email, 
            favouriteTeam, 
            password} = req.body; 
        
        const isUserExist = await User.findOne( {email: email });
        if (isUserExist) {
            return res.status(400).json({ message: "User already exists with this email." });
        }   

        //random salt to encrypt our password (bcrypt)
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        //create and save new user
        const newUser = new User({
            firstName, 
            lastName, 
            email, 
            favouriteTeam, 
            password: passwordHash}); 

        const savedUser = await newUser.save();
        savedUser.password = undefined; //remove password field from the response

        
        //send 201 (CREATED) and send back saveduser 
        res.status(201).json(savedUser); 

    } catch(err) {
        //error code 500, send back err message
        console.error("Error during user registration:", err); // Log the error
        res.status(500).json({error : err.message});
    }
}; 

//LOGGING IN 
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne( {email: email}); 
        if(!user){
            return res.status(400).json({msg: "User does not exist, email not found."}); 
        }

        const correctPassword = await bcrypt.compare(password, user.password); 
        if(!correctPassword){
            return res.status(400).json({msg: "Password is incorrect"}); 
        }

        //jwt 
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); 
        delete user.password; 
        res.status(200).json({token, user}); 

    } catch(err) {
        res.status(500).json({error : err.message});
    }
}

