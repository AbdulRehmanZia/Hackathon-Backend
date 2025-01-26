import express from "express";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { restrictTo } from "../middleware/restrictTo.js";
import historyModel from "../models/historyModel.js";
import sendResponse from "../utils/sendResponse.js";

const router = express.Router();

// 1. Get all logs (admin only) - Using Aggregation Pipeline
router.get(
  "/",
  authenticateUser,
  restrictTo("admin"),
  async (req, res) => {
    try {
      // Aggregation pipeline to fetch logs with user and beneficiary details
      const logs = await historyModel.aggregate([
        {
          $lookup: {
            from: "users", // Join with User collection
            localField: "user",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" }, // Unwind the joined array
        {
          $lookup: {
            from: "beneficiaries", // Join with Beneficiary collection
            localField: "beneficiary",
            foreignField: "_id",
            as: "beneficiaryDetails",
          },
        },
        { $unwind: "$beneficiaryDetails" }, // Unwind the joined array
        {
          $project: {
            _id: 1,
            action: 1,
            details: 1,
            timestamp: 1,
            user: {
              _id: "$userDetails._id",
              CNIC: "$userDetails.CNIC",
              name: "$userDetails.name",
              role: "$userDetails.role",
            },
            beneficiary: {
              _id: "$beneficiaryDetails._id",
              CNIC: "$beneficiaryDetails.CNIC",
              name: "$beneficiaryDetails.name",
            },
          },
        },
        { $sort: { timestamp: -1 } }, // Sort by timestamp (newest first)
      ]);

      return sendResponse(res, 200, logs, true, "Logs retrieved.");
    } catch (error) {
      console.error("Log retrieval error:", error);
      return sendResponse(res, 500, null, false, "Internal Server Error.");
    }
  }
);

// 2. Get logs for a specific beneficiary (admin only) - Using Aggregation Pipeline
router.get(
  "/beneficiary/:beneficiaryId",
  authenticateUser,
  restrictTo("admin"),
  async (req, res) => {
    try {
      const beneficiaryId = req.params.beneficiaryId;

      // Aggregation pipeline to fetch logs for a specific beneficiary
      const logs = await historyModel.aggregate([
        { $match: { beneficiary: mongoose.Types.ObjectId(beneficiaryId) } }, // Match beneficiary ID
        {
          $lookup: {
            from: "users", // Join with User collection
            localField: "user",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" }, // Unwind the joined array
        {
          $project: {
            _id: 1,
            action: 1,
            details: 1,
            timestamp: 1,
            user: {
              _id: "$userDetails._id",
              CNIC: "$userDetails.CNIC",
              name: "$userDetails.name",
              role: "$userDetails.role",
            },
          },
        },
        { $sort: { timestamp: -1 } }, // Sort by timestamp (newest first)
      ]);

      return sendResponse(res, 200, logs, true, "Beneficiary logs retrieved.");
    } catch (error) {
      console.error("Beneficiary log retrieval error:", error);
      return sendResponse(res, 500, null, false, "Internal Server Error.");
    }
  }
);

// 3. Delete a log (admin only)
router.delete(
  "/:logId",
  authenticateUser,
  restrictTo("admin"),
  async (req, res) => {
    try {
      const log = await historyModel.findByIdAndDelete(req.params.logId);
      if (!log) {
        return sendResponse(res, 404, null, false, "Log not found.");
      }

      return sendResponse(res, 200, null, true, "Log deleted.");
    } catch (error) {
      console.error("Log deletion error:", error);
      return sendResponse(res, 500, null, false, "Internal Server Error.");
    }
  }
);

export default router;