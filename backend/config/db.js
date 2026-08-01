import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log("MongoDB Connected âœ…");
  } catch (error) {
    console.log("MongoDB Error âŒ", error.message);
    process.exit(1);
  }
};

export default connectDB;
