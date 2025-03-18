 import brcyptjs from 'bcrypt'
import User from '../models/userModel.js';
import { errorHandler } from '../utils/error.js';
const signup = async (req,res,next)=>{
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

export default signup