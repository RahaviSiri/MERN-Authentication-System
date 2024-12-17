import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js"

const app = express();
const port = process.env.PORT || 3000;
connectDB();

app.use(express.json()); // All request passes in JSON format
app.use(cookieParser());
app.use(cors({credentials : true})); // Can send cookies from express app


app.get("/",(req,res) => {
    res.send("API is working");
})


app.listen(port,() => {
    console.log(`Server running on Port ${port}`)
})