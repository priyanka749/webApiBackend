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
    category: {
        type: String,
        required: true,  
    },
    rating:{
        type:Number,
        required:false
    },
    


   
});

const ServiceProvider = mongoose.model('Provider', providerSchema);

module.exports = ServiceProvider;
