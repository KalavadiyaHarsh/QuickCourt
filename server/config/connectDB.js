import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGODB_URL) {
    throw new Error("❌ Missing MongoDB URL in environment variables.");
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
