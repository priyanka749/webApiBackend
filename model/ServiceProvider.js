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
        
    bio:{
        type:String,
        required:true
    },
  
    rating:{
        type:Number,
        required:false,
        default:0,

    },
    location:{
        type:String,
        required:true
    },
    skills: {
        type: [String],
        required: true,
    },
    
});

const ServiceProvider = mongoose.model('Provider', providerSchema);

module.exports = ServiceProvider;
