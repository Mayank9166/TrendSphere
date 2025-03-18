import express from 'express'
import mongoose from 'mongoose';
import 'dotenv/config'
import authRoutes from './routes/authRoute.js'
const app = express()
app.use(express.json())
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Database is connected successFully");
}).catch((err)=>{
    console.log(err)

});

 
app.use("/api/auth",authRoutes)

app.listen(process.env.PORT||3000,()=>{
    console.log("Server is running on port 3000!");
})
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode||500;
    const message = err.message||"Internal Server Error"
    res.json({
        statusCode,
        message,
        success:false
    })
    next();
})