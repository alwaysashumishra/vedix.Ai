import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MongoDB Error: MONGO_URI is not defined in environment variables");
    return;
  }

  try {
    // High-concurrency connection pool parameters
    await mongoose.connect(mongoUri, {
      maxPoolSize: 100,         // Maintain up to 100 parallel socket connections
      minPoolSize: 10,          // Keep 10 warm connections ready for sub-millisecond queries
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,   // Close sockets after 45s of inactivity
      maxIdleTimeMS: 30000,
    });

    console.log("MongoDB Connected ✅ (High-Concurrency Connection Pool Active)");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    console.log("Retrying MongoDB connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
