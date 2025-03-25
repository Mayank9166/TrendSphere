import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        
    },
    profilePhotoUrl:{
        type:String,
        default:"https://www.flaticon.com/free-icon/user_1077114"
    },
},{timestamps:true})
 
const User = mongoose.model("User",userSchema)
export default User;