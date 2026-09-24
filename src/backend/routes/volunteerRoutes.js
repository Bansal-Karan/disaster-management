import express from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware.js";
import VolunteerApplication from "../models/volunteerModel.js";
import User from "../models/userModel.js";

const router = express.Router();

// 1. Submit or Re-submit Volunteer Application (Logged-in Citizen)
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { phone, location, skills, experience, availability } = req.body;
    const userId = req.user.id;

    if (req.user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "You already hold administrator privileges on AapdaMitra."
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid citizen session."
      });
    }

    if (!phone || !location || !experience) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide your phone number, location, and relevant experience/motivation." 
      });
    }

    // Check if user already has volunteer or admin status
    const userDoc = await User.findById(userId);
    if (userDoc && (userDoc.role === "volunteer" || userDoc.role === "admin")) {
      return res.status(400).json({
        success: false,
        message: `You already hold ${userDoc.role} privileges on AapdaMitra.`
      });
    }

    // Check for existing application
    const existing = await VolunteerApplication.findOne({ userId });

    if (existing) {
      if (existing.status === "Pending") {
        return res.status(400).json({
          success: false,
          message: "You already have a pending application currently under review by our Admin team."
        });
      }
      if (existing.status === "Approved") {
        return res.status(400).json({
          success: false,
          message: "Your application has already been approved."
        });
      }

      // If previously Rejected, allow updating & re-submitting for a fresh review
      existing.name = req.user.name || userDoc?.name || existing.name;
      existing.username = req.user.username || userDoc?.username || existing.username;
      existing.phone = phone.trim();
      existing.location = location.trim();
      existing.skills = Array.isArray(skills) ? skills : [];
      existing.experience = experience.trim();
      existing.availability = availability || "On-Call Emergencies";
      existing.status = "Pending";
      existing.adminNotes = "";
      existing.reviewedBy = null;
      existing.reviewedAt = null;
      existing.createdAt = new Date();

      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Application re-submitted successfully! Disaster Coordinators will review your profile.",
        data: existing
      });
    }

    // Create new application
    const newApp = await VolunteerApplication.create({
      userId,
      name: req.user.name || userDoc?.name || "Citizen Volunteer",
      username: req.user.username || userDoc?.username || "",
      phone: phone.trim(),
      location: location.trim(),
      skills: Array.isArray(skills) ? skills : [],
      experience: experience.trim(),
      availability: availability || "On-Call Emergencies",
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Volunteer application submitted successfully! Our emergency coordinators will review your details.",
      data: newApp
    });
  } catch (error) {
    console.error("Error submitting volunteer application:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to submit application. Please try again later." 
    });
  }
});

// 2. Get current user's volunteer application status
router.get("/my-status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.json({
        success: true,
        isAdmin: true,
        isVolunteer: false,
        application: null
      });
    }

    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({
        success: true,
        isVolunteer: false,
        application: null
      });
    }

    const application = await VolunteerApplication.findOne({ userId });
    
    // Also check current role in user document
    const userDoc = await User.findById(userId);
    const isVolunteer = userDoc?.role === "volunteer";

    res.json({
      success: true,
      isVolunteer,
      application: application || null
    });
  } catch (error) {
    console.error("Error fetching volunteer application status:", error);
    res.status(500).json({ success: false, message: "Could not fetch application status." });
  }
});

// 3. Admin: Fetch all volunteer applications
router.get("/applications", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access restricted: Only disaster administrators can view volunteer applications." 
      });
    }

    const applications = await VolunteerApplication.find().sort({ 
      status: 1, // Pending first alphabetically or handle in UI
      createdAt: -1 
    });

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error("Error fetching applications for admin:", error);
    res.status(500).json({ success: false, message: "Failed to fetch applications." });
  }
});

// 4. Admin: Approve or Reject a volunteer application
router.patch("/applications/:id/review", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access restricted: Only disaster administrators can review volunteer applications." 
      });
    }

    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Status must be either 'Approved' or 'Rejected'." 
      });
    }

    const application = await VolunteerApplication.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    application.status = status;
    application.adminNotes = adminNotes || "";
    application.reviewedBy = req.user.username || "Admin";
    application.reviewedAt = new Date();
    await application.save();

    // If Approved: Promote the User to 'volunteer' role in MongoDB
    if (status === "Approved") {
      await User.findByIdAndUpdate(application.userId, { role: "volunteer" });
    } else if (status === "Rejected") {
      // Ensure user role remains 'user'
      await User.findByIdAndUpdate(application.userId, { role: "user" });
    }

    res.json({
      success: true,
      message: `Volunteer application has been ${status.toLowerCase()} successfully!`,
      data: application
    });
  } catch (error) {
    console.error("Error reviewing volunteer application:", error);
    res.status(500).json({ success: false, message: "Failed to review application." });
  }
});

// 5. Get list of all approved active volunteers (for Admin dispatch assignment)
router.get("/list", authMiddleware, async (req, res) => {
  try {
    // Both Admins and Volunteers can see the team roster
    const volunteers = await User.find({ role: "volunteer" })
      .select("_id name username")
      .lean();

    // Supplement with approved applications if available for phone / skills
    const apps = await VolunteerApplication.find({ status: "Approved" }).lean();
    const appMap = new Map();
    apps.forEach((a) => appMap.set(String(a.userId), a));

    const enriched = volunteers.map((v) => {
      const app = appMap.get(String(v._id));
      return {
        _id: v._id,
        name: v.name,
        username: v.username,
        phone: app?.phone || "On File",
        location: app?.location || "Field Active",
        skills: app?.skills || ["Disaster Relief"],
      };
    });

    res.json({
      success: true,
      data: enriched
    });
  } catch (error) {
    console.error("Error fetching volunteers list:", error);
    res.status(500).json({ success: false, message: "Failed to fetch volunteers roster." });
  }
});

export default router;
