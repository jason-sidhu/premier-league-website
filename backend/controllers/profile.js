/*CONTROLLER FOR PROFILE */
import bcrypt, { compare } from "bcrypt"; 
import User from "../models/User.js"; 


export const getProfile = async(req, res) =>{
    try{
        //from the verify function, we store the user with id in req.user
        const userId = req.user.id;
        const user = await User.findById(userId); 
        if(!user){
            return res.status(401).json({ message: "User not found"}); 
        }
        res.status(200).json(user); 

        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;

        res.status(200).json({ user: userWithoutPassword }); 
    } catch (err) {
        res.status(404).json({ message: err.message }); 
    }
}

export const updateProfile = async(req, res) =>{
    try{
        const userId = req.user.id; 
        const user = await User.findById(userId);   

        if(!user){
            return res.status(401).json({ message: "User not found"}); 
        } 

        //dont update anything if password is incorrect
        const correctPassword = await bcrypt.compare(req.body.currentPassword, user.password); 
        if(!correctPassword){
            return res.status(400).json({msg: "Password is incorrect"}); 
        }

        //if updating email, make sure no other has this one
        if (req.body.newEmail && req.body.newEmail !== user.email) {
            const existingUser = await User.findOne({ email: req.body.newEmail });

            if (existingUser) {
                return res.status(400).json({ message: "Email is already in use" });
            }
            user.email = req.body.newEmail;
        }

        //update any other info
        if(req.body.newFirstName){user.firstName = req.body.newFirstName}; 
        if(req.body.newLastName){user.lastName = req.body.newLastName}
        if(req.body.newFavouriteTeam){user.favouriteTeam = req.body.newFavouriteTeam}
        if(req.body.newPassword){
            //random salt to encrypty our password (bcrypt)
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(newPassword, salt);
            user.password = passwordHash; 
        }

        await user.save(); 
        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;

        res.status(200).json({ user: userWithoutPassword }); 
    } catch (err) {
        res.status(500).json({ message: err.message}); 
    }
}

export const deleteProfile = async(req, res) =>{
    try{
        const userId = req.user.id; 
        const user = await User.findById(userId); 

        if(!user){
            res.status(404).json({ message: "User not found"}); 
        }

        const correctPassword = bcrypt.compare(req.body.currentPassword, user.password); 
        if(!correctPassword){
            return res.status(400).json({msg: "Password is incorrect"}); 
        }

        await User.findByIdAndDelete(userId); 
        res.status(200).json({ message: "User account deleted successfully."}); 

    } catch (err) {
        res.status(500).json({ message: err.message}); 
    }
}