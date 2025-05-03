import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

const cached: MongooseCache = (
  global as unknown as { mongoose?: MongooseCache }
).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    console.error("MONGODB_URI is missing from environment variables");
    return;
  }
  try {
    cached.promise =
      cached.promise ||
      mongoose.connect(MONGODB_URI).then((m) => {
        return m.connection;
      });

    cached.conn = await cached.promise;
    console.log("Connected to MongoDB successfully");
    return cached.conn;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};
