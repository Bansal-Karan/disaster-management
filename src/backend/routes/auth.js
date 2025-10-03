import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req,res) => {
    const { name, username, password, role } = req.body;

    const existingUser = await User.findOne({username, role})

    if(existingUser) {
        return res.status(400).json({success: false, message: "User already exist"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({name,username,password: hashedPassword, role});
    newUser.save();

    res.json({success: true, message: "User registered successfully"});
});