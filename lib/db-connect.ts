import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "diplomat-corner";

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

const cached: MongooseCache = (
  global as unknown as { mongoose?: MongooseCache }
).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  if (!MONGODB_URI) {
    console.error("MONGODB_URI is missing from environment variables");
    throw new Error("MONGODB_URI is missing from environment variables");
  }

  try {
    console.log("Connecting to MongoDB...");
    cached.promise =
      cached.promise ||
      mongoose
        .connect(MONGODB_URI, {
          dbName: DB_NAME,
        })
        .then((m) => {
          console.log(
            `Connected to MongoDB database '${DB_NAME}' successfully`
          );
          return m.connection;
        });

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    cached.promise = null;
    throw error;
  }
};
