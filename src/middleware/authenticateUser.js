import jwt from "jsonwebtoken";
import sendResponse from "../utils/sendResponse.js";
import userModel from "../models/userModel.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return sendResponse(res, 401, null, false, "Token not provided.");
    }

    const decoded = jwt.verify(token, process.env.AUTH_SECRET);

    
    const user = await userModel.findById(decoded._id).lean();
    if (!user) {
      return sendResponse(res, 401, null, false, "User not found.");
    }

    
    // req.user = {
    //   _id: user._id,
    //   CNIC: user.CNIC,
    //   role: user.role,
    //   department: user.department, // For staff role checks
    // };
req.user = user;
    next();
  } catch (error) {
    // Handle token expiration explicitly
    if (error.name === "TokenExpiredError") {
      return sendResponse(res, 401, null, false, "Token expired.");
    }
    return sendResponse(res, 401, null, false, "Invalid token.");
  }
};


