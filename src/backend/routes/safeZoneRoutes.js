import express from "express";
import SafeZone from "../models/safeZoneModel.js";

const router = express.Router();

// Get all safe zones
router.get("/", async (req, res) => {
  const zones = await SafeZone.find();
  res.json(zones);
});



export default router;