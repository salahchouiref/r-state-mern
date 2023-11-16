import { errorHandler } from "./errorHandler.js";
import jwt from "jsonwebtoken";
export const verifyToken = (req,res,next) => {
    const token = req.cookies.accessToken;
    if(!token) return next(errorHandler(401,"Unauthorized"));
    jwt.verify(token,process.env.TOKEN_CODE,(err,user)=>{
        if (err) return next(errorHandler(403,"Unauthorized action"));
        req.user = user;
        next();
    });
}