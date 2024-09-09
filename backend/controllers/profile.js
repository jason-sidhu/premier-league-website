/*CONTROLLER FOR PROFILE */
import bcrypt, { compare } from "bcrypt"; 
import User from "../models/User.js"; 
import UserScoreModel from "../models/UserScoreModel.js"; // Import the UserScoreModel
import PredictionModel from "../models/PredictionModel.js"; 


export const getProfile = async (req, res) => {
    try {
        // Get the user ID from req.user (set by the authentication middleware)
        const userId = req.user.id;
        const user = await User.findById(userId);

        // If user is not found, return an error
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Remove sensitive information before sending the user data
        const userWithoutPassword = { ...user._doc }; // Spread the user object
        delete userWithoutPassword.password; // Remove the password

        // Send the user data without sensitive information
        res.status(200).json(userWithoutPassword);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, email, username, favoriteTeam, newPassword, currentPassword } = req.body;

        // Fetch user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If a new password is provided, hash and update it
        if (newPassword && currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        // Update user fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.favoriteTeam = favoriteTeam || user.favoriteTeam;

        // Save updated user to the database
        await user.save();

        res.status(200);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: "Failed to update profile" });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const password = req.body.password;
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            return res.status(400).json({ msg: "Password is incorrect" });
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        // Delete the associated UserScoreModel entry
        await UserScoreModel.deleteMany({ userId });

        // Delete the associated PredictionModel entries
        await PredictionModel.deleteMany({ userId });

        return res.status(200).json({ message: "User account and associated data deleted successfully." });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};