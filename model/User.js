const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
   
    },
    phone_number: {
        type: String,
        required: true,
        unique: true, 
    },
    
    location: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        enum: ["User", "Service Provider"],
        required:true,
}});

const User = mongoose.model("users", userSchema);
module.exports = User;
