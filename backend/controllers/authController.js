 import brcyptjs from 'bcrypt'
import User from '../models/userModel.js';
import { errorHandler } from '../utils/error.js';
import jwt from "jsonwebtoken"
import 'dotenv/config'
 export const signup = async (req,res,next)=>{
  const {username,email,password}=req.body;
if(!username || !email||!password || username===""||email==="" ||password==="")
{
   return next(errorHandler(400,"All fields are required"));
}
const hashPassword = brcyptjs.hashSync(password,10);
const newUser = new User({
    username,
    email,
    password:hashPassword
})
try {
    await newUser.save()
    res.status(200).json({message:"Signup Successfully"})
} catch (error) {
    next(error)
}
}
export const signin = async (req,res,next)=>{
    // console.log(req.body)
    const {email,password}=req.body;
    if(!email || !password || email===""||password==="")
    {
        return next(errorHandler(400,"All fields are required"));
    }
    try {
        const validUser = await User.findOne({email});
        if(!validUser)
        {
            return next(errorHandler(404,"User not found"))
        }
        const validPassword = brcyptjs.compareSync(password,validUser.password);
        if(!validPassword)
        {
           return next(errorHandler(400,"Wrong credentials"));
        }
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET)
        const {password:pass,...rest}=validUser._doc;
        res.status(200).cookie("access_token",token,{httpOnly:true}).json(rest);

    } catch (error) {
        next(error);
    }
}
export const google  = async  (req,res,next)=>{
    const {email,name,profilePhotoUrl} = req.body;
    try {
        const user = await User.findOne({email});
         if(user)
         {
                const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
                const {password:pass,...rest}=user._doc;
                return res.status(200).cookie("access_token",token,{httpOnly:true}).json(rest);
         }
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashPassword = brcyptjs.hashSync(generatedPassword,10);
        const newUser = new User({
            username: name.toLowerCase().split(" ").join("")+Math.random().toString(9).slice(-4),
            email,
            password:hashPassword,
            profilePhotoUrl
             
        })
        await newUser.save();
        const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)
        const {password:pass,...rest}=newUser._doc;
       return  res.status(200).cookie("access_token",token,{httpOnly:true}).json(rest);
        
    } catch (error) {

        next(error)
    }
}
 
// export default signin