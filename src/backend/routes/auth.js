import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';

dotenv.config();

const router = express.Router();

// Helper to retrieve JWT Secret strictly from environment variables (.env)
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is missing. Please define it in your .env file.");
    }
    return secret;
};

// Helper to dynamically read admin credentials from environment variables (.env)
const getAdminCredentials = () => {
    const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "";
    return {
        email,
        password,
        prefix: email ? email.split("@")[0] : "",
        user: {
            id: "admin-system-001",
            name: process.env.ADMIN_NAME || "Administrator",
            username: email,
            role: "admin",
        }
    };
};

// Allow registration for Citizens and Volunteers only (Admin account is fixed and restricted)
router.post('/register', async (req, res) => {
    try {
        const { name, username, password, role } = req.body;
        if (!username || !password || !name) {
            return res.status(400).json({ success: false, message: "Please provide name, username/email, and password." });
        }

        const cleanUsername = username.trim().toLowerCase();
        const admin = getAdminCredentials();

        // Strictly block anyone trying to register as Admin
        if (role === 'admin' || cleanUsername === admin.email || cleanUsername === admin.prefix) {
            return res.status(403).json({
                success: false,
                message: "Admin account creation is prohibited. System administrator is pre-configured."
            });
        }

        // All registrations are strictly Citizens. Becoming a volunteer requires applying and Admin approval.
        const assignedRole = 'user';

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: "Database connecting. Please wait a moment and try again."
            });
        }

        const existingUser = await User.findOne({ username: cleanUsername });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "An account with this username/email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name: name.trim(),
            username: cleanUsername,
            role: assignedRole,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: "Citizen account registered successfully! You can sign in and apply to join the volunteer rescue team anytime.",
            data: { id: newUser._id, name: newUser.name, username: newUser.username, role: newUser.role }
        });
    } catch (error) {
        console.error("Error in /register:", error);
        res.status(500).json({ success: false, message: "Registration failed. Please try again." });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Please provide both username/email and password" });
        }

        const cleanInput = username.trim().toLowerCase();
        const admin = getAdminCredentials();

        // 1. Direct validation against environment credentials (.env)
        const isEmailMatch = admin.email && (cleanInput === admin.email || cleanInput === admin.prefix);
        const isPasswordMatch = admin.password && password === admin.password;

        if (isEmailMatch && isPasswordMatch) {
            const secret = getJwtSecret();
            const token = jwt.sign(
                { username: admin.user.username, role: admin.user.role, id: admin.user.id, name: admin.user.name },
                secret,
                { expiresIn: "30d" }
            );

            // Background upsert to MongoDB if connected so record persists
            if (mongoose.connection.readyState === 1) {
                User.findOne({ username: admin.user.username }).then(async (found) => {
                    if (!found) {
                        const hashed = await bcrypt.hash(admin.password, 10);
                        User.create({
                            name: admin.user.name,
                            username: admin.user.username,
                            password: hashed,
                            role: "admin"
                        }).catch(() => {});
                    }
                }).catch(() => {});
            }

            res.cookie("token", token, {
                maxAge: 30 * 24 * 3600 * 1000,
                secure: process.env.NODE_ENV === "production",
                httpOnly: true,
                sameSite: "lax",
                path: "/"
            });

            return res.status(200).json({
                success: true,
                message: "Signed in successfully",
                token,
                user: admin.user
            });
        }

        // 2. Database lookup fallback if MongoDB is ready
        if (mongoose.connection.readyState === 1) {
            const userRegex = new RegExp(`^${cleanInput}$`, "i");
            const existingUser = await User.findOne({
                $or: [{ username: userRegex }, { name: userRegex }]
            });

            if (existingUser) {
                const passwordMatch = await bcrypt.compare(password, existingUser.password);
                if (passwordMatch) {
                    const secret = getJwtSecret();
                    const userRole = existingUser.role || "user";
                    const token = jwt.sign(
                        { username: existingUser.username, role: userRole, id: existingUser._id, name: existingUser.name },
                        secret,
                        { expiresIn: "7d" }
                    );

                    return res.status(200).json({
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
                }
            }
        }

        return res.status(401).json({
            success: false,
            message: "Invalid username/email or password."
        });
    } catch (error) {
        console.error("Error in /login:", error.message || error);
        if (error.message && error.message.includes("JWT_SECRET")) {
            return res.status(500).json({
                success: false,
                message: "Server configuration error: JWT_SECRET missing in .env"
            });
        }
        res.status(500).json({ success: false, message: "Authentication service error" });
    }
});

router.get('/check-auth', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

        // If admin system account, return as is
        if (user.role === 'admin') {
            return res.status(200).json({ success: true, message: "User authenticated", user });
        }

        // Fetch fresh role from MongoDB if available
        if (mongoose.connection.readyState === 1 && user.id && mongoose.Types.ObjectId.isValid(user.id)) {
            const dbUser = await User.findById(user.id).select("-password");
            if (dbUser) {
                const refreshedUser = {
                    id: dbUser._id,
                    name: dbUser.name,
                    username: dbUser.username,
                    role: dbUser.role || "user",
                };
                return res.status(200).json({ success: true, message: "User authenticated", user: refreshedUser });
            }
        }

        res.status(200).json({ success: true, message: "User authenticated", user });
    } catch (err) {
        res.status(200).json({ success: true, message: "User authenticated", user: req.user });
    }
});

export default router