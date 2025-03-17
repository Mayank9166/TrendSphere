import express from 'express'
import mongoose from 'mongoose';
import 'dotenv/config'

const app = express()
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Database is connected successFully");
}).catch((err)=>{
    console.log(err)

});

app.listen(process.env.PORT||3000,()=>{
    console.log("Server is running on port 3000!");
})