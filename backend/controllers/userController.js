import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js"
import bcrypt from 'bcryptjs';
export const updateUser = async (req, res,next) => {
    if (!req.user || !req.user.id) {
  return next(errorHandler(401, "Unauthorized: Invalid token or user not found"));
}
    if(req.body.password)
    {
        if(req.body.password.length < 8)
        {
            return next(errorHandler(400, "Password must be at least 8 characters long!"));
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10); 
        req.body.password = hashedPassword;
   }
  if (req.body.username) {
  if (req.body.username.length < 5 || req.body.username.length > 20) {
    return next(errorHandler(400, "Username must be between 5 and 20 characters long!"));
  }

  if (req.body.username.includes(" ")) {
    req.body.username = req.body.username.replace(/\s+/g, '');
  }

  req.body.username = req.body.username.toLowerCase();

  if (req.body.username.match(/[^a-z0-9]+$/)) {
    return next(errorHandler(400, "Username can only contain lowercase letters and numbers!"));
  }
}

   try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
        $set:{
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profilePhotoUrl: req.body.profilePhotoUrl

        } 
    }, { new: true });
    const {password : pass, ...rest} = updatedUser._doc; 
    res.status(200).json(rest);
   } catch (error) {
    next(error);
   }
}
