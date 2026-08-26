import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";

const getGoogleClientId = () => process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

const createToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const isDbConnected = () => mongoose.connection.readyState === 1;

const handleDbDisconnected = (res) => {
  return res.status(503).json({
    success: false,
    message: "Database connection is unavailable. Ensure MONGO_URI is set in Railway variables and MongoDB Atlas Network Access allows 0.0.0.0/0.",
  });
};

const normalizeUsername = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 18) || "user";

const buildUniqueUsername = async (seed) => {
  const base = normalizeUsername(seed);
  let candidate = base;
  let counter = 1;

  while (await User.findOne({ username: candidate })) {
    candidate = `${base}${counter}`;
    counter += 1;
  }

  return candidate;
};

export const registerUser = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return handleDbDisconnected(res);
    }

    const {
      username,
      name,
      surname,
      dob,
      email,
      password,
      profilePic,
    } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, Email, and Password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.trim();

    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (existingUser) {
      if (existingUser.email === cleanEmail) {
        return res.status(400).json({
          success: false,
          message: "An account with this email already exists",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Username is already taken",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username: cleanUsername,
      name: name || "",
      surname: surname || "",
      dob: dob || "",
      email: cleanEmail,
      password: hashedPassword,
      profilePic: profilePic || "",
    });

    const token = createToken(newUser);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        surname: newUser.surname,
        dob: newUser.dob,
        email: newUser.email,
        profilePic: newUser.profilePic,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Registration failed. Please try again.",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return handleDbDisconnected(res);
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "This account has been blocked by admin",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google sign-in. Continue with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = createToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        surname: user.surname,
        dob: user.dob,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    const googleClientId = getGoogleClientId();

    if (!googleClientId) {
      return res.status(500).json({
        success: false,
        message: "Google auth is not configured on the server",
      });
    }

    const googleClient = new OAuth2Client(googleClientId);
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({
        success: false,
        message: "Unable to read Google account details",
      });
    }

    let user = await User.findOne({ email: payload.email.toLowerCase() });

    if (!user) {
      const fullName = payload.name?.trim() || payload.email.split("@")[0];
      const [firstName = fullName, ...rest] = fullName.split(" ");
      const surname = payload.family_name || rest.join(" ");

      user = await User.create({
        username: await buildUniqueUsername(payload.email.split("@")[0]),
        name: payload.given_name || firstName,
        surname,
        dob: "",
        email: payload.email.toLowerCase(),
        profilePic: payload.picture || "",
        googleId: payload.sub,
      });
    } else {
      user.googleId = user.googleId || payload.sub;
      user.profilePic = user.profilePic || payload.picture || "";
      user.name = user.name || payload.given_name || "";
      user.surname = user.surname || payload.family_name || "";
      await user.save();
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "This account has been blocked by admin",
      });
    }

    const token = createToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        surname: user.surname,
        dob: user.dob,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Google sign-in failed",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return handleDbDisconnected(res);
    }

    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and New Password are required",
      });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 4 characters long",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "This account has been blocked by admin",
      });
    }

    if (!user.password && user.googleId) {
      return res.status(400).json({
        success: false,
        message: "This account was created using Google sign-in. Password cannot be reset.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to reset password. Please try again.",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return handleDbDisconnected(res);
    }

    const { userId, email, username, name, surname, dob, profilePic } = req.body;

    if (!userId && !email) {
      return res.status(400).json({
        success: false,
        message: "User ID or Email is required to update profile",
      });
    }

    const query = userId ? { _id: userId } : { email: email.toLowerCase().trim() };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (username && username.trim() !== user.username) {
      const cleanUsername = username.trim();
      const existingUser = await User.findOne({ username: cleanUsername });

      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Username is already taken by another user",
        });
      }

      user.username = cleanUsername;
    }

    if (name !== undefined) user.name = name;
    if (surname !== undefined) user.surname = surname;
    if (dob !== undefined) user.dob = dob;
    if (profilePic !== undefined) user.profilePic = profilePic;

    await user.save();

    const updatedUser = {
      _id: user._id,
      username: user.username,
      name: user.name,
      surname: user.surname,
      dob: user.dob,
      email: user.email,
      profilePic: user.profilePic,
    };

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};
