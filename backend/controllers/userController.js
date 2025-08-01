import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from 'bcryptjs';

export const updateUser = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(errorHandler(401, "Unauthorized: Invalid token or user not found"));
  }
   console.log("Updating user:", req.params.userId, req.body);
  try {
    const updateFields = {};

    // Validate and process password
    if (req.body.password) {
      if (req.body.password.length < 8) {
        return next(errorHandler(400, "Password must be at least 8 characters long!"));
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updateFields.password = hashedPassword;
    }

    // Validate and process username
    if (req.body.username) {
      if (req.body.username.length < 5 || req.body.username.length > 20) {
        return next(errorHandler(400, "Username must be between 5 and 20 characters long!"));
      }

      let username = req.body.username.replace(/\s+/g, '').toLowerCase();

      if (username.match(/[^a-z0-9]+$/)) {
        return next(errorHandler(400, "Username can only contain lowercase letters and numbers!"));
      }

      updateFields.username = username;
    }

    // Add other optional fields
    if (req.body.email) updateFields.email = req.body.email;
    
    // Handle profile image update
    if (req.body.profilePicture) {
      // Validate that it's a valid URL
      try {
        const url = new URL(req.body.profilePicture);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          updateFields.profilePhotoUrl = req.body.profilePicture;
        } else {
          return next(errorHandler(400, "Invalid image URL!"));
        }
      } catch (error) {
        return next(errorHandler(400, "Invalid image URL format!"));
      }
    }

    // Update the user
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateFields },
      { new: true }
    );
    // console.log("Updated user:", updatedUser);

    const { password: pass, ...rest } = updatedUser._doc;
    res.status(200).json(rest);

  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if(!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You can only delete your own account!"));
  }
  
  try {
  
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}
export const signout = async (req,res,next) => {
  console.log(req.body);
    try {
       res.clearCookie("access_token", {
         httpOnly: true,
         sameSite: "none",
         secure: true,
         domain: ".onrender.com",
         path: "/"
       }).status(200).json({ message: "User has been logged out successfully" });

    } catch (error) {
      
    }
}

export const getUsers = async (req,res,next) =>{
     if(!req.user.isAdmin)
      return next(errorHandler(403, "You are not authorized to access this resource!"))
    try {
      const startIndex = parseInt(req.query.startIndex)||0;
      const limit = parseInt(req.query.limit)||9;
      const sortDirection = req.query.sort === "asc"?1:-1;

      const users = await User.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit);
      const getUsersWithoutPassword = users.map((user)=>{
        const {password:pass,...rest}=user._doc;
        return rest;
      })
      const totalUsers = await User.countDocuments();
          
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthUsers = await User.countDocuments({
      createdAt:{$gte:oneMonthAgo},
    })
    res.status(200).json({
      users:getUsersWithoutPassword,
      totalUsers,
      lastMonthUsers
    })

    } catch (error) {
      next(error);
    }
}

export const getUserbyId = async(req,res,next)=>{
  try {
    const user = await User.findById(req.params.userId);
    if(!user)
      return next(errorHandler(404,"User not found!"));
    const {password,...rest}=user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}
