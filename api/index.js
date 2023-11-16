import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

const databaseConnection = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_LINK).then(()=>{
            console.log("connected to mongodb");
        })
    }catch(err){
        console.log(err);
    }
}; 
databaseConnection();

app.listen(3000,()=>{
    console.log("app is running on : http://localhost:3000");
});

app.use("/api/user",userRouter);
app.use("/api/auth",authRouter);

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "internal server error";
    return res.status(statusCode).json({
        success : false,
        statusCode,
        message,
    })
});