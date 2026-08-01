import mongoose from "mongoose";

const usageEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "api",
      trim: true,
    },
    path: {
      type: String,
      default: "",
      trim: true,
    },
    method: {
      type: String,
      default: "GET",
      trim: true,
    },
    statusCode: {
      type: Number,
      default: 200,
    },
    ip: {
      type: String,
      default: "unknown",
      trim: true,
    },
    userAgent: {
      type: String,
      default: "",
    },
    durationMs: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

usageEventSchema.index({ createdAt: 1 });
usageEventSchema.index({ path: 1, createdAt: 1 });
usageEventSchema.index({ ip: 1, createdAt: 1 });

const UsageEvent = mongoose.model("UsageEvent", usageEventSchema);

export default UsageEvent;
