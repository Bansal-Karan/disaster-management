// backend/routes/sosRoutes.js
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email, phone, location, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,

            },
        });

        await transporter.sendMail({
            from: `"SOS Alert" <${process.env.EMAIL_USER}>`,
            to: process.env.RECEIVER_EMAIL,
            subject: "🚨 New SOS Request Received",
            html: `
        <h2>New SOS Request</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Location:</b> ${location}</p>
        <p><b>Message:</b> ${message}</p>
      `,
        });

        res.json({ success: true, message: "SOS request sent successfully!" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to send SOS request" });
    }
});

export default router;
