import express from "express";
import dotenv from "dotenv";
import sosRoutes from "./routes/sosRoutes.js";
import cors from "cors";
import mongoDb from "./config/db.js";


dotenv.config();
mongoDb();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/sos", sosRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));