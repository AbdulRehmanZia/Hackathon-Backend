import express from "express";
import "dotenv/config";
import morgan from "morgan";
import authRoutes from "./routers/auth.js";
import userRoutes from "./routers/user.js";
import connectDB from "./db/connectDB.js";

const app = express();
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is Running on Port: ${PORT}`));

app.use(morgan("dev"));
app.use(express.json());

connectDB();
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => res.send("Server Is Running on Port 5000"));
