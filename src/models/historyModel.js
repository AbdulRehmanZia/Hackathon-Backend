import mongoose from "mongoose";
const { Schema } = mongoose;
const logSchema = new Schema({
    action: {
      type: String,
      required: true,
      enum: ['registration', 'status_update', 'user_created'], 
    },
    details: {
      type: String, // E.g., "Beneficiary registered for financial aid"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users', // Who performed the action (admin/receptionist/staff)
    },
    beneficiary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'beneficiary', // Which beneficiary was affected
    },
  }, { timestamps: true });

const historyModel = mongoose.model("history", logSchema);
export default historyModel