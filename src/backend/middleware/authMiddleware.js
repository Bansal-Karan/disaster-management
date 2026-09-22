import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const secret = process.env.JWT_SECRET || "bansalthegreat";
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
