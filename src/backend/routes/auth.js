import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {

        const { name, username, password, role } = req.body;
        console.log(name, username, password, role)

        const existingUser = await User.findOne({ username, role })

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exist" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            username,
            role,
            password: hashedPassword
        })

        res.json({ success: true, message: "User registered successfully", data: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
        console.log("Error in /register ", error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Please provide both username and password" });
        }

        const cleanUsername = username.trim();
        const userRegex = new RegExp(`^${cleanUsername}$`, "i");

        // Look up by username or name (case-insensitive)
        let query = {
            $or: [
                { username: userRegex },
                { name: userRegex }
            ]
        };

        let existingUser = await User.findOne(query);

        if (!existingUser) {
            return res.status(400).json({ success: false, message: "Invalid Credentials: User not found" });
        }

        // bcrypt.compare(plainPassword, hashedPassword) - must be awaited!
        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (!passwordMatch) {
            return res.status(400).json({ success: false, message: "Invalid Credentials: Incorrect password" });
        }

        const userRole = existingUser.role || "user";
        const token = jwt.sign(
            { username: existingUser.username, role: userRole, id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            maxAge: 7 * 24 * 3600 * 1000,
            secure: false,
            httpOnly: true,
            sameSite: "lax",
            path: "/"
        }).status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                username: existingUser.username,
                role: userRole
            }
        });
    } catch (error) {
        console.error("Error in /login:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.get('/check-auth', authMiddleware, async (req, res) => {
    const user = req.user;

    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" })
    res.status(200).json({ success: true, message: "User authenticated", user });
});

export default router