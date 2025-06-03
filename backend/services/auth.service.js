import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { create } from "../store/user.store.js";
import { throwErrorWithStatus } from "../errorHandler.js";

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
}

export async function signup(data) {
  const { username, email, password } = data;

  // Validate required fields
  if (!username || !email || !password) {
    throwErrorWithStatus(400, "Name, email and password are required");
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throwErrorWithStatus(409, "Email already registered");
  }

  // Check if username already exists
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throwErrorWithStatus(409, "Username already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await create({
    username,
    email,
    password: hashedPassword,
  });

  const savedUser = await user.save();

  const token = generateToken({ userId: savedUser._id });

  return {
    savedUser,
    token,
  };
}

export async function login(data) {
  const { email, password } = data;

  if (!email || !password) {
    throwErrorWithStatus(400, "Username and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throwErrorWithStatus(400, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throwErrorWithStatus(400, "Invalid credentials");
  }

  const token = generateToken({ userId: user._id, email: user.email });

  return {
    user,
    token,
  };
}
