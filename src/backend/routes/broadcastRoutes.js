import express from "express";
import Broadcast from "../models/broadcastModel.js";

const router = express.Router();

// 1. Fetch active broadcasts (within 24-hour window)
router.get("/", async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const broadcasts = await Broadcast.find({
      createdAt: { $gte: twentyFourHoursAgo },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: broadcasts.length,
      data: broadcasts,
    });
  } catch (err) {
    console.error("Error fetching broadcasts:", err);
    res.status(500).json({ success: false, error: "Failed to fetch broadcasts" });
  }
});

// 2. Post new broadcast (Admin privilege, 24-hour auto-expiry)
router.post("/", async (req, res) => {
  try {
    const { title, message, severity, author } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Broadcast title is required" });
    }

    const newBroadcast = await Broadcast.create({
      title: title.trim(),
      message: message ? message.trim() : "",
      severity: severity || "WARNING",
      author: author || "Disaster Response Admin",
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Emergency bulletin broadcasted across network successfully",
      data: newBroadcast,
    });
  } catch (err) {
    console.error("Error creating broadcast:", err);
    res.status(500).json({ success: false, error: "Failed to post broadcast" });
  }
});

// 3. Delete broadcast early (Admin option)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Broadcast.findByIdAndDelete(id);
    res.json({ success: true, message: "Broadcast bulletin removed" });
  } catch (err) {
    console.error("Error deleting broadcast:", err);
    res.status(500).json({ success: false, error: "Failed to delete broadcast" });
  }
});

export default router;
