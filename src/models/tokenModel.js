import mongoose from "mongoose";
const { Schema } = mongoose;

const tokenSchema = new Schema({
    tokenId: {
      type: String,
      required: true,
      unique: true, 
    },
    department: {
      type: String,
      required: true,
      enum: ['finance', 'medical', 'education', 'general'], 
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    remarks: {
      type: String, 
    },
    beneficiary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'beneficiary', 
      required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true,
      },
  }, { timestamps: true });

const tokenModel = mongoose.model("token", tokenSchema);
export default tokenModel