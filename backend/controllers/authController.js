import bcryptjs from 'bcrypt';
import User from '../models/userModel.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Signup Controller
export const signup = async (req, res, next) => {
  try {
    console.log("Signup request body:", req.body);
    
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === "" || email === "" || password === "") {
      console.log("Validation failed - missing fields");
      return next(errorHandler(400, "All fields are required"));
    }

    console.log("Creating new user with:", { username, email });

    const hashPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashPassword
    });

    console.log("Saving user to database...");
    await newUser.save();
    console.log("User saved successfully");
    
    res.status(200).json({ success: true, message: "Signup Successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return next(errorHandler(400, `${field} already exists`));
    }
    
    next(error);
  }
};

// Signin Controller
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Wrong credentials"));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    return res
      .status(200)
      .cookie("access_token", token, { 
        httpOnly: true,
        sameSite: "none",
        secure: true
      })
      .json({ success: true, user: rest });
  } catch (error) {
    next(error);
  }
};

// Google Auth Controller
export const google = async (req, res, next) => {
  const { email, name, profilePhotoUrl } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password: pass, ...rest } = user._doc;
      return res
        .status(200)
        .cookie("access_token", token, { 
          httpOnly: true,
          sameSite: "none",
          secure: true
        })
        .json({ success: true, user: rest });
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashPassword = bcryptjs.hashSync(generatedPassword, 10);
    const newUser = new User({
      username:
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4),
      email,
      password: hashPassword,
      profilePhotoUrl,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = newUser._doc;

    return res
      .status(200)
      .cookie("access_token", token, { 
        httpOnly: true,
        sameSite: "none",
        secure: true
      })
      .json({ success: true, user: rest });
  } catch (error) {
    next(error);
  }
};
