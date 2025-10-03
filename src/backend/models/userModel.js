import mongoose from "mongoose";
import {Schema} from "mongoose";

const userSchema = new Schema({
    name: String,
    usename: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["user", "volunteer", "admin"], default: "user" },
})

export default mongoose.model("User", userSchema);