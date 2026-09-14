import mongoose from "mongoose";

const sosSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Assigned", "In Progress", "Resolved"],
    default: "Pending",
  },
  assignedTo: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SOS", sosSchema);
