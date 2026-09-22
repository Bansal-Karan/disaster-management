import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();

// Helper to dynamically read admin credentials from environment variables (.env)
const getAdminCredentials = () => {
    const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "";
    return {
        email,
        password,
        prefix: email.split("@")[0],
        user: {
            id: "admin-karan-001",
            name: "Karan Bansal",
            username: email || "karan@admin.com",
            role: "admin",
        }
    };
};

// Public user registration is disabled per specification (Single fixed Admin system)
router.post('/register', async (req, res) => {
    return res.status(403).json({
        success: false,
        message: "Public registration is disabled. System access is restricted to authorized Administrator."
    });
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
            const secret = process.env.JWT_SECRET || "bansalthegreat";
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
                message: "Administrator authenticated successfully",
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
                    const secret = process.env.JWT_SECRET || "bansalthegreat";
                    const userRole = existingUser.role || "user";
                    const token = jwt.sign(
                        { username: existingUser.username, role: userRole, id: existingUser._id },
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
            message: "Invalid credentials. Authorized admin access only."
        });
    } catch (error) {
        console.error("Error in /login:", error);
        res.status(500).json({ success: false, message: "Authentication service error" });
    }
});

router.get('/check-auth', authMiddleware, async (req, res) => {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    res.status(200).json({ success: true, message: "User authenticated", user });
});

export default router