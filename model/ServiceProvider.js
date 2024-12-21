const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
    
    
     userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true,
        },

    image:{
        type:String,
        required:false
        },
    
    Provider_name: {
        type: String,
        required: true,
    },
    
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure email is unique
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please enter a valid email address'],
    },
    phoneNumber: {
        type: String,
        required: true,  
        unique: true,  
    },
    category: {
        type: String,
        required: true,  
    },
    password: {
        type: String,
        required: true,  

    }
});

const ServiceProvider = mongoose.model('Provider', providerSchema);

module.exports = ServiceProvider;
