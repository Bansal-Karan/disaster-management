export const authMiddleware = async (req, res, next) => {

    try {
        const token = req.cookies("token") || req.headers["authorization"]?.split(" ")[1]
        if (!token) res.status(401).json({ success: false, message: "Unauthorized" })

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        console.log("Error in AuthMiddleware ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}
