import userModel from "../models/userModel.js";
import {
  editUserSchema,
} from "../validations/schemas.js";
import sendResponse from "../utilis/sendResponse.js";
import express from "express";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

//edit user


router.get('/all-users', async (req, res) => {
  try {
    const users = await userModel.find();
    sendResponse(res, 200, users, true, "Users Fetched Successfully");
  }
  catch (err) {
    sendResponse(res, 500, null, false, "Something went wrong");
  }
}
)
router.put("/edit/:id", authenticateUser, async (req, res) => {
  console.log("Editing user...");
try {
    const { id } = req.params;
    const { value, error } = editUserSchema.validate(req.body);
  
    if (error) return sendResponse(res, 400, null, false, error.message);
  
    const userExists = userModel.findById(id);
  
    if (!userExists)
      return sendResponse(res, 404, null, false, "User not Found.");
  
    const updatedUserObj = { ...value };
  
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { $set: { ...updatedUserObj } },
      { new: true, runValidators: true }
    );
  
    if (!updatedUser) {
      return sendResponse(res, 404, null, false, "Failed to edit user.");
    }
  
    return sendResponse(res, 201, updatedUser, true, "User edited successfully.");
  
} catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, false, "Internal Server Error.");
}
});

//delete user

router.delete("/delete/:id", async (req, res) => {
 try {
    const { id } = req.params;

    const userExists = await userModel.findById(id);
  
    if (!userExists)
      return sendResponse(res, 404, null, false, "User not found.");
  
    const deletedUser = await userModel.findByIdAndDelete(id);
  
    return sendResponse(
      res,
      201,
      deletedUser,
      true,
      "User deleted successfully."
    );
 } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, false, "Internal Server Error.");
 }
});

export default router;