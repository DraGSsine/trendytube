import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI!);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}