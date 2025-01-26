import express from "express";
import userModel from "../models/userModel.js";
import { editUserSchema } from "../validations/schemas.js";
import sendResponse from "../utils/sendResponse.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = express.Router();

// 1. Get all users (admin only) 
router.get(
  "/all-users",
  authenticateUser,
  restrictTo("admin"),
  async (req, res) => {
    try {
      // Aggregation pipeline to fetch all users with additional details
      const users = await userModel.aggregate([
        {
          $project: {
            _id: 1,
            CNIC: 1,
            name: 1,
            role: 1,
            department: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        { $sort: { createdAt: -1 } }, // Sort by creation date (newest first)
      ]);

      return sendResponse(res, 200, users, true, "Users fetched successfully.");
    } catch (error) {
      console.error("Fetch all users error:", error);
      return sendResponse(res, 500, null, false, "Internal Server Error.");
    }
  }
);

// 2. Get a single user by ID 
router.get(
  "/:id",
  authenticateUser,
  restrictTo("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const user = await userModel.findById(id)
      if (!user) {
        return sendResponse(res, 404, null, false, "User not found.");
      }

      return sendResponse(res, 200, user, true, "User fetched successfully.");
    } catch (error) {
      console.error("Fetch single user error:", error);
      return sendResponse(res, 500, null, false, "Internal Server Error.");
    }
  }
);

// Get current user (authenticated user)
router.get(
  "/my-info",
  authenticateUser,
  async (req, res) => {
    try {
      // Fetch current user (from req.user attached by authenticateUser middleware)
      const user = await userModel.findById(req.user._id)
      if (!user) {
        return sendResponse(res, 404, null, false, "User not found.");
      }

      return sendResponse(res, 200, user, true, "User info fetched successfully.");
    } catch (error) {
      console.error("Fetch current user error:", error);
      return sendResponse(res, 500, null, false, "Internal Server Error.");
    }
  }
);

// 4. Edit user (admin only)
router.put(
  "/edit/:id",
  authenticateUser,
  restrictTo("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Validate request body
      const { error, value } = editUserSchema.validate(req.body);
      if (error) {
        return sendResponse(res, 400, null, false, error.message);
      }

      // Check if user exists
      const userExists = await userModel.findById(id);
      if (!userExists) {
        return sendResponse(res, 404, null, false, "User not found.");
      }

      // Update user
      const updatedUser = await userModel.findByIdAndUpdate(
        id,
        { $set: value },
        { new: true, runValidators: true }
      ).select("-password"); // Exclude password

      return sendResponse(res, 200, updatedUser, true, "User updated successfully.");
    } catch (error) {
      console.error("Edit user error:", error);
      return sendResponse(res, 500, null, false, "Internal Server Error.");
    }
  }
);

// 5. Delete user (admin only)
router.delete(
  "/delete/:id",
  authenticateUser,
  restrictTo("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Check if user exists
      const userExists = await userModel.findById(id);
      if (!userExists) {
        return sendResponse(res, 404, null, false, "User not found.");
      }

      // Delete user
      const deletedUser = await userModel.findByIdAndDelete(id);
      return sendResponse(res, 200, deletedUser, true, "User deleted successfully.");
    } catch (error) {
      console.error("Delete user error:", error);
      return sendResponse(res, 500, null, false, "Internal Server Error.");
    }
  }
);

export default router;