const mongoose = require("mongoose");
const { Schema } = mongoose;

const tempUserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["Customer", "Service Provider"],
        required: true,
    },
    name: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    
    profileImage: {
     type: String },

    bio: {
        type: String,
    },
    otp: {
        type: String,
    },
    
    rating: {
        type: Number,
        default: 0,
    },
    skills: {
        type: [String],
        required: true,
    },
});

const TempUser = mongoose.model("tempUsers", tempUserSchema);
module.exports = TempUser;
