import mongoose from "mongoose";

const safeZoneSchema = new mongoose.Schema({
    name: String,
    type: { type: String, enum: ["Shelter", "Hospital", "Relief Camp", "Police Station"], default: "Shelter" },
    address: String,
    latitude: Number,
    longitude: Number,
    capacity: Number,
    contact: String,
});

const SafeZone = mongoose.model("SafeZone", safeZoneSchema);