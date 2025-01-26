import express from "express";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { restrictTo } from "../middleware/restrictTo.js";
import tokenModel from "../models/tokenModel.js";
import benificiaryModel from "../models/benificiaryModel.js";
import sendResponse from "../utils/sendResponse.js";
import { nanoid } from "nanoid";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  restrictTo("receptionist"),
  async (req, res) => {
    try {
      const { beneficiaryId, department } = req.body;

      if (!mongoose.Types.ObjectId.isValid(beneficiaryId)) {
        return sendResponse(res, 400, null, false, "Invalid beneficiary ID.");
      }

      const beneficiary = await benificiaryModel.findById(beneficiaryId);
      if (!beneficiary) {
        return sendResponse(res, 404, null, false, "Beneficiary not found.");
      }

      const tokenId = `TKN-${nanoid(10)}`;

      const token = await tokenModel.create({
        tokenId,
        department,
        beneficiary: beneficiaryId,
      });

      beneficiary.tokens.push(token._id);
      await beneficiary.save();

      return sendResponse(res, 201, token, true, "Token created.");
    } catch (error) {
      console.error("Token creation error:", error.message);
      return sendResponse(res, 500, null, false, "Internal Server Error.");
    }
  }
);


// Scan a token (staff only) - Using Aggregation Pipeline
router.get(
  "/:tokenId",
  authenticateUser,
  restrictTo("staff"),
  async (req, res) => {
    try {
      const tokenId = req.params.tokenId;

      const token = await tokenModel.aggregate([
        { $match: { tokenId } },
        {
          $lookup: {
            from: "beneficiaries",
            localField: "beneficiary",
            foreignField: "_id",
            as: "beneficiaryDetails",
          },
        },
        { $unwind: "$beneficiaryDetails" },
        {
          $project: {
            _id: 1,
            tokenId: 1,
            department: 1,
            status: 1,
            remarks: 1,
            createdAt: 1,
            updatedAt: 1,
            beneficiary: {
              _id: "$beneficiaryDetails._id",
              CNIC: "$beneficiaryDetails.CNIC",
              name: "$beneficiaryDetails.name",
              phone: "$beneficiaryDetails.phone",
              address: "$beneficiaryDetails.address",
              purpose: "$beneficiaryDetails.purpose",
            },
          },
        },
      ]);

      if (!token.length) {
        return sendResponse(res, 404, null, false, "Token not found.");
      }

      return sendResponse(res, 200, token[0], true, "Token details retrieved.");
    } catch (error) {
      console.error("Token scan error:", error.message);
      return sendResponse(res, 500, null, false, "Internal Server Error.");
    }
  }
);


// 3. Update token status (staff only)
router.put(
  "/:tokenId",
  authenticateUser,
  restrictTo("staff"),
  async (req, res) => {
    try {
      const { status, remarks } = req.body;

      const token = await tokenModel.findOneAndUpdate(
        { tokenId: req.params.tokenId },
        { status, remarks },
        { new: true }
      );

      if (!token) {
        return sendResponse(res, 404, null, false, "Token not found.");
      }

      return sendResponse(res, 200, token, true, "Token status updated.");
    } catch (error) {
      console.error("Token update error:", error);
      return sendResponse(res, 500, null, false, "Internal Server Error.");
    }
  }
);

// 4. Delete a token (admin only)
router.delete(
  "/:tokenId",
  authenticateUser,
  restrictTo("admin"),
  async (req, res) => {
    try {
      const token = await tokenModel.findOneAndDelete({ tokenId: req.params.tokenId });
      if (!token) {
        return sendResponse(res, 404, null, false, "Token not found.");
      }

      return sendResponse(res, 200, null, true, "Token deleted.");
    } catch (error) {
      console.error("Token deletion error:", error);
      return sendResponse(res, 500, null, false, "Internal Server Error.");
    }
  }
);

export default router;