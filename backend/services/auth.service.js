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

 
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throwErrorWithStatus(400, "Email already in use");
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