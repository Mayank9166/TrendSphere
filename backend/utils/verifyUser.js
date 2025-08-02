import { errorHandler } from "./error.js"
import jwt from "jsonwebtoken"
import User from "../models/userModel.js";

export const verifyToken = (req, res, next) => {
   console.log('=== VERIFY TOKEN DEBUG ===');
   console.log('Request URL:', req.url);
   console.log('Request method:', req.method);
   console.log('Origin:', req.headers.origin);
   console.log('All cookies:', req.cookies);
   console.log('Cookie names:', Object.keys(req.cookies || {}));
   console.log('Authorization header:', req.headers.authorization);
   console.log('All headers:', req.headers);
   
   const token = req.cookies.access_token
   console.log('Access token from cookies:', token);
   
   if(!token) {
       console.log('❌ No token found in cookies');
       console.log('Available cookies:', req.cookies);
       return next(errorHandler(401, "Unauthorized!"))
   }
   
   jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
       if(err) {
           console.log('❌ Token verification failed:', err.message);
           return next(errorHandler(403, "Token is not valid!"))
       }
       
       console.log('🔍 JWT Token payload:', user);
       console.log('🔍 JWT Token isAdmin:', user.isAdmin);
       console.log('🔍 JWT Token user ID:', user.id);
       
       // Always check the database for the latest user data
       try {
           const currentUser = await User.findById(user.id);
           if (!currentUser) {
               console.log('❌ User not found in database');
               return next(errorHandler(404, "User not found"));
           }
           
           console.log('🔍 Database user isAdmin:', currentUser.isAdmin);
           console.log('🔍 Database user ID:', currentUser._id);
           
           // Check if admin status has changed
           if (user.isAdmin !== currentUser.isAdmin) {
               console.log('🔄 Admin status changed! JWT:', user.isAdmin, 'DB:', currentUser.isAdmin);
               
               // Generate new token with updated admin status
               const newToken = jwt.sign(
                   { id: currentUser._id, isAdmin: currentUser.isAdmin },
                   process.env.JWT_SECRET,
                   { expiresIn: '30d' }
               );
               
               // Set new cookie
               res.cookie("access_token", newToken, { 
                   httpOnly: true,
                   sameSite: "none",
                   secure: true,
                   path: "/",
                   maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
               });
               
               console.log('✅ Token updated with new admin status');
               req.user = { id: currentUser._id, isAdmin: currentUser.isAdmin };
           } else {
               console.log('✅ Admin status unchanged');
               req.user = user;
           }
           
           // Check if token is close to expiring (within 7 days)
           const tokenExp = user.exp * 1000; // Convert to milliseconds
           const now = Date.now();
           const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
           
           if (tokenExp - now < sevenDaysInMs) {
               console.log('🔄 Token expiring soon, refreshing...');
               try {
                   // Generate new token
                   const newToken = jwt.sign(
                       { id: currentUser._id, isAdmin: currentUser.isAdmin },
                       process.env.JWT_SECRET,
                       { expiresIn: '30d' }
                   );
                   
                   // Set new cookie
                   res.cookie("access_token", newToken, { 
                       httpOnly: true,
                       sameSite: "none",
                       secure: true,
                       path: "/",
                       maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
                   });
                   
                   console.log('✅ Token refreshed automatically');
                   req.user = { id: currentUser._id, isAdmin: currentUser.isAdmin };
               } catch (refreshError) {
                   console.log('❌ Token refresh failed:', refreshError.message);
                   req.user = { id: currentUser._id, isAdmin: currentUser.isAdmin }; // Use database data
               }
           }
           
       } catch (dbError) {
           console.log('❌ Database error:', dbError.message);
           req.user = user; // Use original token if database check fails
       }
       
       next();
   })
}