import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { registerSchema, loginSchema } from "../validations/schemas.js";
import sendResponse from "../utilis/sendResponse.js";
import express from "express";

const router = express.Router();
//Register a new user

router.post("/register", async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);

    if (error) return sendResponse(res, 400, null, false, error.message);

    const existingUser = await userModel.findOne({ email: value.email });

    if (existingUser)
      return sendResponse(
        res,
        403,
        null,
        false,
        "User with this email already exists."
      );

    const hashedPassword = await bcrypt.hash(value.password, 10);
    value.password = hashedPassword;

    let newUser = new userModel({ ...value });
    newUser = await newUser.save();

    return sendResponse(
      res,
      201,
      newUser,
      true,
      "User registered successfully."
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, false, "Internal Server Error.");
  }
});

//Login a user

router.post("/login", async (req, res) => {
  try {
    const { value, error } = loginSchema.validate(req.body);

    if (error) return sendResponse(res, 400, null, false, error.message);

    const user = await userModel.findOne({ email: value.email }).lean();

    if (!user)
      return sendResponse(
        res,
        404,
        null,
        false,
        "No user found with this email."
      );

    const isPasswordCorrect = await bcrypt.compare(
      value.password,
      user.password
    );

    if (!isPasswordCorrect)
      return sendResponse(res, 403, null, false, "Invalid credentials.");

    var token = jwt.sign(user, process.env.AUTH_SECRET);

    return sendResponse(
      res,
      200,
      { user, token },
      true,
      "User logged in successfully."
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, false, "Internal Server Error.");
  }
});

export default router;
