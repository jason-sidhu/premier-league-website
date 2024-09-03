import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken"; 
import User from "../models/User.js"; 

// Register user 
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            username,
            email,
            favouriteTeam,
            password
        } = req.body;

        const isUserExist = await User.findOne({ email: email });
        if (isUserExist) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        const isUsernameExist = await User.findOne({ username: username });
        if (isUsernameExist) {
            return res.status(400).json({ message: "Username already taken." });
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            favouriteTeam,
            password: passwordHash
        });

        const savedUser = await newUser.save();
        savedUser.password = undefined; // Remove password field from the response

        res.status(201).json(savedUser);

    } catch (err) {
        console.error("Error during user registration:", err);
        res.status(500).json({ error: err.message });
    }
};

// Logging in 
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist, email not found." });
        }

        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
