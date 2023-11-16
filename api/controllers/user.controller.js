import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import User from "../models/User.model.js";

export const test = (req,res)=>{
    res.json({message : "api test is working"});
};

export const update = async (req,res,next) =>{
    if(req.user.id !== req.params.id) return next(errorHandler(403,"You can only update your own account"));
    try{
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username : req.body.username, 
                email : req.body.email, 
                password : req.body.password, 
                profilePicture : req.body.profilePicture, 
            }
        },{new : true});
        const {password,...rest} = updatedUser._doc;
        res.status(200).json(rest);
    }catch(err){
        next(err);
    }
}