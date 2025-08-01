import { errorHandler } from "./error.js"
import jwt from "jsonwebtoken"
export const verifyToken = (req, res, next) => {
   const token = req.cookies.access_token
   console.log('Cookies received:', req.cookies);
   console.log('Access token:', token);
   if(!token) {
       console.log('No token found in cookies');
       return next(errorHandler(401, "Unauthorized!"))
   }
   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
       if(err) {
           console.log('Token verification failed:', err.message);
           return next(errorHandler(403, "Token is not valid!"))
       }
       console.log('Token verified successfully for user:', user);
       req.user = user;
       next();
   })
}