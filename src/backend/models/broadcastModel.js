import mongoose from "mongoose";

const broadcastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    severity: {
      type: String,
      enum: ["CRITICAL", "WARNING", "ADVISORY"],
      default: "WARNING",
    },
    author: {
      type: String,
      default: "Disaster Coordination Cell",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400, // 24 hours in seconds (MongoDB TTL auto-removal)
    },
  },
  { timestamps: true }
);

// TTL index to automatically purge documents after 24 hours (86400 seconds)
broadcastSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Broadcast = mongoose.model("Broadcast", broadcastSchema);
export default Broadcast;
