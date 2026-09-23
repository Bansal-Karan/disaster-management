// backend/routes/sosRoutes.js
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import SOS from "../models/sosModel.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

// 1. Submit SOS Beacon (Secured - only logged in users can dispatch SOS)
router.post("/", authMiddleware, async (req, res) => {
    const { name, email, phone, location, message } = req.body;

    try {
        // Always record emergency in MongoDB first
        const newSOS = await SOS.create({
            name,
            email,
            phone,
            location,
            message,
            status: "Pending",
        });

        // Attempt sending email alert asynchronously
        try {
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.RECEIVER_EMAIL) {
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                await transporter.sendMail({
                    from: `"AapdaMitra SOS Alert" <${process.env.EMAIL_USER}>`,
                    to: process.env.RECEIVER_EMAIL,
                    subject: "🚨 [AapdaMitra] New SOS Request Received",
                    html: `
                        <h2>New SOS Request</h2>
                        <p><b>Name:</b> ${name}</p>
                        <p><b>Phone:</b> ${phone}</p>
                        <p><b>Location:</b> ${location}</p>
                        <p><b>Message:</b> ${message}</p>
                        <p><b>Incident ID:</b> ${newSOS._id}</p>
                    `,
                });
            }
        } catch (mailErr) {
            console.warn("Mail notification warning (SOS still recorded):", mailErr.message);
        }

        res.status(201).json({ 
            success: true, 
            message: "SOS request recorded and dispatched successfully!", 
            data: newSOS 
        });
    } catch (err) {
        console.error("Error saving SOS:", err);
        res.status(500).json({ success: false, error: "Failed to record SOS request" });
    }
});

// 2. Fetch all SOS Requests (Secured - For Admin & Volunteer Dashboard)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const incidents = await SOS.find().sort({ createdAt: -1 });
        res.json(incidents);
    } catch (err) {
        console.error("Error fetching SOS incidents:", err);
        res.status(500).json({ error: "Failed to fetch incidents" });
    }
});

// 3. Update SOS Status / Claim Mission (Secured - For Volunteers & Admins)
router.patch("/:id/status", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assignedTo } = req.body;

        const updated = await SOS.findByIdAndUpdate(
            id,
            { 
                ...(status ? { status } : {}),
                ...(assignedTo !== undefined ? { assignedTo } : {})
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Incident not found" });
        }

        res.json({ success: true, message: "Incident status updated", data: updated });
    } catch (err) {
        console.error("Error updating incident status:", err);
        res.status(500).json({ success: false, error: "Failed to update incident" });
    }
});

// 4. Delete SOS Request (Secured - For Admins to clear resolved/test records)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await SOS.findByIdAndDelete(id);
        res.json({ success: true, message: "Incident record removed" });
    } catch (err) {
        console.error("Error deleting incident:", err);
        res.status(500).json({ success: false, error: "Failed to delete incident" });
    }
});

export default router;
