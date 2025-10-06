import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, username, password, role } = req.body;

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
});

router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username, role })


    if (!existingUser) {
        return res.status(400).json({ success: false, message: "Invalid Credentials" })
    }

    const passwordMatch = bcrypt.compare(existingUser.password, password);

    if (!passwordMatch) return res.status(400).json({ success: false, message: "Invalid Credentials" })

    const token = jwt.sign({ username, role, id: existingUser._id }, process.env.JWT_SECRET)


    res.cookie("token", token, {
        maxAge: 7 * 24 * 3600, 
        secure: false, 
        httpOnly: true, 
        sameSite: "lax", 
        path: "/"
    }).status(200).json({ success: true, message: "User logged in successfully", token });
});

export default router