import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDb = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("⚠️ MONGO_URI is missing! Please configure it in your Render Environment Variables.");
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message || error);
    }
};

export default connectDb;