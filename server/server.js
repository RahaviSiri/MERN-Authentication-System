import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRoute.js";

const app = express();
const port = process.env.PORT || 3000;
connectDB();

app.use(express.json()); // All request passes in JSON format
app.use(cookieParser());
const allowedOrigins = ["http://localhost:5173"];
app.use(cors({origin: allowedOrigins, credentials : true})); // Can send cookies from express app

// API Endpoints
app.get("/",(req,res) => {
    res.send("API is working");
})
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);


app.listen(port,() => {
    console.log(`Server running on Port ${port}`)
})