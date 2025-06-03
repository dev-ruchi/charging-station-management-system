import express from "express";
const router = express.Router();
import { signup, login } from "../services/auth.service.js";
import { userValidationRules } from "../rules/user.rules.js";

router.post("/register", userValidationRules, async (req, res) => {
  try {
    const { savedUser, token } = await signup(req.body);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
      },
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ message: "Signup failed", error: err.message });
  }
});

router.post("/login", userValidationRules, async (req, res) => {
  try {
    const { user, token } = await login(req.body);

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.email },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(err.statusCode || 400).json({
      message: "Login failed",
      error: err.message,
    });
  }
});

export default router;
