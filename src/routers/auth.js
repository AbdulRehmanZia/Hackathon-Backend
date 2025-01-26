import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import userModel from "../models/userModel.js";
import sendResponse from "../utils/sendResponse.js";
import { registerSchema, loginSchema } from "../validations/schemas.js";

const router = express.Router();

// Register (Admin Only)
router.post("/register", async (req, res) => {
  try {
   
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return sendResponse(res, 400, null, false, error.message);
    }

    
    const existingUser = await userModel.findOne({ CNIC: value.CNIC });
    if (existingUser) {
      return sendResponse(res, 409, null, false, "CNIC already registered.");
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);
    value.password = hashedPassword;

    const newUser = await userModel.create(value);
    const userData = newUser.toObject();
    delete userData.password;

    return sendResponse(res, 201, userData, true, "User registered.");
  } catch (error) {
    console.error("Registration error:", error);
    return sendResponse(res, 500, null, false, "Internal Server Error.");
  }
});

router.post("/login", async (req, res) => {
  try {
    // Validate request body
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return sendResponse(res, 400, null, false, error.message);
    }

    const user = await userModel.findOne({ CNIC: value.CNIC }).lean();
    if (!user) {
      return sendResponse(res, 404, null, false, "CNIC not found.");
    }

    const isPasswordValid = await bcrypt.compare(value.password, user.password);
    if (!isPasswordValid) {
      return sendResponse(res, 401, null, false, "Invalid credentials.");
    }

    const payload = {
      _id: user._id,
      CNIC: user.CNIC,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.AUTH_SECRET, {
     
    });


    return sendResponse(res, 200, { user, token }, true, "Login successful.");
  } catch (error) {
    console.error("Login error:", error);
    return sendResponse(res, 500, null, false, "Internal Server Error.");
  }
});

export default router;