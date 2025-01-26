import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log("\n \n MongoDB connected");
  } catch (err) {
    console.log("\n \n Error in MongoDB connection.");
    console.log("Err ===>>>", err);
   process.exit(1);
  }
};

export default connectDB;
