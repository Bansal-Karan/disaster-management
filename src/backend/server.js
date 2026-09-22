import express from "express";
import dotenv from "dotenv";
import sosRoutes from "./routes/sosRoutes.js";
import cors from "cors";
import mongoDb from "./config/db.js";
import safeZoneRoutes from "./routes/safeZoneRoutes.js"
import userRoutes from "./routes/auth.js"
import { authMiddleware } from "./middleware/authMiddleware.js";
import cookieParser from "cookie-parser"

import mongoose from "mongoose";
import broadcastRoutes from "./routes/broadcastRoutes.js";

dotenv.config();
mongoDb();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      /\.vercel\.app$/,
      ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : []),
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/sos", sosRoutes);
app.use("/api/safeZones", safeZoneRoutes);
app.use("/api/safezones", safeZoneRoutes);
app.use("/api/user", userRoutes);
app.use("/api/broadcasts", broadcastRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ status: "online", message: "AapdaMitra API is running live" });
});

app.get("/api/db-status", (req, res) => {
  const state = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  res.status(200).json({
    databaseStatus: states[state] || "unknown",
    readyState: state,
    hasMongoUri: !!process.env.MONGO_URI,
    mongoUriConfigured: process.env.MONGO_URI
      ? `${process.env.MONGO_URI.substring(0, 14)}...`
      : "NONE",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));