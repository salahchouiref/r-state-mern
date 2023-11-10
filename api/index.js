import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();
const app = express();

app.use(express.json());

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