// routes/userRoutes.js

import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.put("/update-profile/:id", async (req, res) => {
  try {

    const { profilePic } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { profilePic },
      { new: true }
    );

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

export default router;