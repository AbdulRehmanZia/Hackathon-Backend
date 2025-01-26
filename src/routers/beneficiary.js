import express from "express";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { restrictTo } from "../middleware/restrictTo.js";
import benificiaryModel from "../models/benificiaryModel.js";
import tokenModel from "../models/tokenModel.js";
import { beneficiarySchema } from "../validations/schemas.js"; // Your Joi schema
import sendResponse from "../utils/sendResponse.js";

const router = express.Router();


router.post(
  "/",
  authenticateUser, // Verify JWT token
  restrictTo("receptionist"), // Only receptionists can register beneficiaries
  async (req, res) => {
    try {
      // 1. Validate request body with Joi
      const { error, value } = beneficiarySchema.validate(req.body);
      if (error) {
        return sendResponse(res, 400, null, false, error.message);
      }

      // 2. Check if beneficiary already exists by CNIC
      const existingBeneficiary = await benificiaryModel.findOne({ CNIC: value.CNIC });
      if (existingBeneficiary) {
        return sendResponse(res, 409, null, false, "Beneficiary already exists.");
      }

      // 3. Create beneficiary
      const newBeneficiary = await benificiaryModel.create({
        CNIC: value.CNIC,
        name: value.name,
        phone: value.phone,
        address: value.address,
        purpose: value.purpose,
      });

      // 4. Generate a token for the beneficiary (simplified example)
      const token = await tokenModel.create({
        tokenId: `TKN-${Date.now()}`, // Replace with a unique ID generator
        department: "general", // Assign department based on purpose
        beneficiary: newBeneficiary._id,
      });

      // 5. Link token to beneficiary
      newBeneficiary.tokens.push(token._id);
      await newBeneficiary.save();

      // 6. Send response (exclude sensitive data)
      const responseData = {
        beneficiary: newBeneficiary,
        token: token.tokenId,
      };
      return sendResponse(res, 201, responseData, true, "Beneficiary registered.");
    } catch (error) {
      console.error("Beneficiary registration error:", error);
      return sendResponse(res, 500, null, false, "Internal Server Error.");
    }
  }
);

export default router;