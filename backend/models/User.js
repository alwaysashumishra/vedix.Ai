import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      default: "",
      trim: true,
    },

    surname: {
      type: String,
      default: "",
      trim: true,
    },

    dob: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
    },

    profilePic: {
      type: String,
      default: "",
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    plan: {
      type: String,
      enum: ["Free", "Pro", "Premium"],
      default: "Free",
    },

    credits: {
      type: Number,
      default: 25,
      min: 0,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    lastAdminNote: {
      type: String,
      default: "",
      trim: true,
    },

    studentVerificationStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },

    studentCollegeName: {
      type: String,
      default: "",
      trim: true,
    },

    studentIdCard: {
      type: String,
      default: "",
    },

    studentRequestDate: {
      type: Date,
      default: null,
    },

    studentRejectReason: {
      type: String,
      default: "",
    },

    proAccessUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;

