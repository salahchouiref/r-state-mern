import jwt from "jsonwebtoken";

export const createToken = (user) => {
    const token = jwt.sign({id:user._id},process.env.TOKEN_CODE);
    const {password : hashedPassword,...rest} = user._doc;
    const expiryDate = new Date(Date.now()+3600000*24);
    return {rest,token,expiryDate};
}