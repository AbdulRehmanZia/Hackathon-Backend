import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  CNIC: {
    type: String,
    required: true,
    unique: true, 
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'receptionist', 'staff'], 
    required: true,
  },
  department: {
    type: String,
    required: function() { return this.role === 'staff'; } // Staff must have a department
  }
}, { timestamps: true });

const userModel = mongoose.model("users", userSchema);

export default userModel