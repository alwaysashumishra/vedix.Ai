import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const getGoogleClientId = () => process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

const createToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

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
        message: "Username is already taken. Please choose another.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username: cleanUsername,
      name: name || "",
      surname: surname || "",
      dob: dob || "",
      email: cleanEmail,
      password: hashedPassword,
      profilePic: profilePic || "",
    });

    const token = createToken(user);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error("Register Error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(400).json({
        success: false,
        message: `This ${field} is already registered. Please use another.`,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Registration failed. Please try again.",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

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
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
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
      user,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Google sign-in failed",
    });
  }
};


