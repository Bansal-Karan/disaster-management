import mongoose from "mongoose";

const volunteerApplicationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  skills: [{ 
    type: String 
  }],
  experience: { 
    type: String, 
    required: true 
  },
  availability: { 
    type: String, 
    default: "On-Call Emergencies" 
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  adminNotes: { 
    type: String, 
    default: "" 
  },
  reviewedBy: { 
    type: String, 
    default: null 
  },
  reviewedAt: { 
    type: Date, 
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.model("VolunteerApplication", volunteerApplicationSchema);
