import express from "express";
import SafeZone from "../models/safeZoneModel.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all safe zones (Secured - logged in users only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const zones = await SafeZone.find();
    res.json(zones);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch safe zones" });
  }
});

// Create new safe zone (Secured)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, type, address, latitude, longitude, capacity, contact } = req.body;
    
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ success: false, message: "Missing required shelter details" });
    }

    const newZone = await SafeZone.create({
      name,
      type: type || "Shelter",
      address,
      latitude: Number(latitude),
      longitude: Number(longitude),
      capacity: Number(capacity) || 100,
      contact: contact || "Emergency Dispatch",
    });

    res.status(201).json({ success: true, message: "Safe zone added successfully", data: newZone });
  } catch (error) {
    console.error("Error creating safe zone:", error);
    res.status(500).json({ success: false, error: "Failed to create safe zone" });
  }
});

// Delete safe zone (Secured)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await SafeZone.findByIdAndDelete(id);
    res.json({ success: true, message: "Safe zone removed successfully" });
  } catch (error) {
    console.error("Error deleting safe zone:", error);
    res.status(500).json({ success: false, error: "Failed to delete safe zone" });
  }
});

export default router;