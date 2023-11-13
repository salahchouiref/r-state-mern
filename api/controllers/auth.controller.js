import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import { createToken } from "../utils/token.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    // Handle database-related errors
    next(errorHandler(550, err.message));
  }
};
  
export const signin = async (req,res,next)=>{
  const {email,password} = req.body;
  try{
    const validUser = await User.findOne({email});
    if(!validUser) return next(errorHandler(404,"User not found !"));
    const validPassword = bcryptjs.compareSync(password,validUser.password);
    if(!validPassword) return next(errorHandler(401,"wrong credentials!"));
    const {token,expiryDate,rest }= createToken(validUser);
    res.cookie("accessToken",token,{
      httpOnly :true,
      expires : expiryDate,
    }).status(200).json(rest);
  }catch(err){
    next(err);
  }
}