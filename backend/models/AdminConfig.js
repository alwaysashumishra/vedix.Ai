import mongoose from "mongoose";

const adminConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    updatedBy: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const AdminConfig = mongoose.model("AdminConfig", adminConfigSchema);

export default AdminConfig;
