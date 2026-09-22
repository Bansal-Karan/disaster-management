import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("AuthMiddleware Error: JWT_SECRET missing in .env");
            return res.status(500).json({
                success: false,
                message: "Server configuration error: JWT_SECRET is not configured in .env."
            });
        }

        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Error in AuthMiddleware:", error.message || error);
        return res.status(401).json({
            message: "Session expired or invalid token. Please log in again.",
            success: false
        });
    }
};
