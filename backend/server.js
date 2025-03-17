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