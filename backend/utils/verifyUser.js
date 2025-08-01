import { errorHandler } from "./error.js"
import jwt from "jsonwebtoken"
export const verifyToken = (req, res, next) => {
   console.log('=== VERIFY TOKEN DEBUG ===');
   console.log('Request URL:', req.url);
   console.log('Request method:', req.method);
   console.log('All cookies:', req.cookies);
   console.log('All headers:', req.headers);
   
   const token = req.cookies.access_token
   console.log('Access token:', token);
   
   if(!token) {
       console.log('❌ No token found in cookies');
       return next(errorHandler(401, "Unauthorized!"))
   }
   
   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
       if(err) {
           console.log('❌ Token verification failed:', err.message);
           return next(errorHandler(403, "Token is not valid!"))
       }
       console.log('✅ Token verified successfully for user:', user);
       req.user = user;
       next();
   })
}