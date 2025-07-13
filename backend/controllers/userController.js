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
    // console.log("hamara",req.body);
    if (req.body.profilePicture) updateFields.profilePhotoUrl = req.body.profilePicture;

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
  if(req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You can only delete your own account!"));
  }
  
  try {
  
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User deleted successfully" });
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}
