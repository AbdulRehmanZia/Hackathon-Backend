import sendResponse from "../utilis/sendResponse.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import userModel from "../models/userModel.js";

export async function authenticateUser(req, res, next) {
  try {
    console.log("Starting authentication...");

    //Getting the token from the Authorization header
    const bearerToken = req?.headers?.authorization;
    console.log("\n\nAuthorization Header: ", bearerToken);

    const token = bearerToken?.split(" ")[1];
    console.log("\n\nExtracted Token: ", token);

    if (!token) {
      console.log("No token provided");
      return sendResponse(res, 403, null, true, "Token not provided");
    }

    //Verifying the token
    console.log("Verifying token...");
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    console.log("Decoded Token: ", decoded);

    //Checking if token is valid
    if (decoded) {
      console.log("Token verified successfully. Fetching user...");

      //Fetching the user from the database using the decoded _id
      const user = await userModel.findById(decoded._id).lean();
      console.log("Fetched User: ", user);

      if (!user) {
        console.log("User not found in database");
        return sendResponse(res, 403, null, true, "User not found");
      }

      //Attaching user to the request object and move to the next
      console.log(
        "User authenticated successfully. Attaching user to request..."
      );
      req.user = user;
      next();
    } else {
      console.log("Decoded token is invalid");
      sendResponse(res, 500, null, true, "Something went wrong");
    }
  } catch (err) {
    console.error("Error during authentication: ", err);
    sendResponse(res, 500, null, true, "Internal Server Error");
  }
}
