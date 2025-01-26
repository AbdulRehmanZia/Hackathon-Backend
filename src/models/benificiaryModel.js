import mongoose from "mongoose";
const { Schema } = mongoose; 

const benificiaryPersonSchema = new Schema({
    CNIC: {
      type: String,
      required: true,
      unique: true, 
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: ['financial aid', 'medical assistance', 'education', 'other'], 
    },
    tokens: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'token', // Link to tokens assigned to the beneficiary
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', 
      required: true,
    },
  },
   { timestamps: true })

const benificiaryModel = mongoose.model("benificiary", benificiaryPersonSchema);
export default benificiaryModel