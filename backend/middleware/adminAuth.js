import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getAllowedAdminEmails = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin login required",
      });
    }

    const adminEmails = getAllowedAdminEmails();

    if (!adminEmails.length) {
      return res.status(500).json({
        success: false,
        message: "Admin panel is not configured. Add ADMIN_EMAILS in Railway.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user || !adminEmails.includes(user.email.toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access admin panel",
      });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin session",
    });
  }
};
