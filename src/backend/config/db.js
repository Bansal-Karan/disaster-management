import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let lastDbError = null;
let isConnecting = false;

const getMongoUri = () => process.env.MONGODB_URI || process.env.MONGO_URI;

const connectDb = async () => {
    if (mongoose.connection.readyState === 1 || isConnecting) return;
    const uri = getMongoUri();
    if (!uri) {
        lastDbError = "MONGO_URI / MONGODB_URI environment variable is not defined on server.";
        console.error("⚠️ " + lastDbError);
        return;
    }
    try {
        isConnecting = true;
        await mongoose.connect(uri, {
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
    if (mongoose.connection.readyState === 0 && getMongoUri()) {
        connectDb();
    } else if (mongoose.connection.readyState === 1) {
        clearInterval(retryTimer);
    }
}, 5000);

export const getDbError = () => lastDbError;
export default connectDb;