import mongoose from "mongoose";

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    fullname: { type: String, required: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    profileImg: { type: String },
    city: { type: String, lowercase: true },
    country: { type: String, lowercase: true },
    isProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);
export default userModel;
