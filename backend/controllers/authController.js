 import brcyptjs from 'bcrypt'
import User from '../models/userModel.js';
const signup = async (req,res)=>{
const {username,email,password}=req.body;
if(!username || !email||!password || username===""||email==="" ||password==="")
{
    return res.status(400).json({message:"All fields are required"});
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
    res.status(500).json(error.message);
}
}

export default signup