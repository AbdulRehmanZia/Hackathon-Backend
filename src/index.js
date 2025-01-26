import express from "express";
import "dotenv/config";
import morgan from "morgan";
import authRoutes from "./routers/auth.js";
import beneficiaryRoutes from "./routers/beneficiary.js";
import historyRoutes from "./routers/history.js";
import tokenRoutes from "./routers/token.js";
import userRoutes from "./routers/user.js";
import connectDB from "./db/connectDB.js";
import cors from "cors";

const app = express();
app.use(cors())
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is Running on Port: ${PORT}`));

app.use(morgan("dev"));
app.use(express.json());

connectDB();
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/beneficiary", beneficiaryRoutes);
app.use("/token", tokenRoutes);
app.use("/history", historyRoutes);

app.get("/", (req, res) => res.send("Server Is Running on Port 5000"));
