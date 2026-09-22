import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let lastDbError = null;
let isConnecting = false;

const connectDb = async () => {
    if (mongoose.connection.readyState === 1 || isConnecting) return;
    if (!process.env.MONGO_URI) {
        lastDbError = "MONGO_URI environment variable is not defined on server.";
        console.error("⚠️ " + lastDbError);
        return;
    }
    try {
        isConnecting = true;
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        lastDbError = null;
        console.log("MongoDB connected successfully");
    } catch (error) {
        lastDbError = error.message || String(error);
        console.error("MongoDB connection error:", lastDbError);
    } finally {
        isConnecting = false;
    }
};

// Automatically retry connection every 5 seconds until successful
const retryTimer = setInterval(() => {
    if (mongoose.connection.readyState === 0 && process.env.MONGO_URI) {
        connectDb();
    } else if (mongoose.connection.readyState === 1) {
        clearInterval(retryTimer);
    }
}, 5000);

export const getDbError = () => lastDbError;
export default connectDb;