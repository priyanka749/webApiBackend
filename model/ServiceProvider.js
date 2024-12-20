const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
    
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
        required: true,  // Phone number of the service provider
        unique: true,  // Ensure phone number is unique
    },
    category: {
        type: String,
        required: true,  // Category of service (e.g., plumber, carpenter)
    },
    password: {
        type: String,
        required: true,  // Password for the service provider

    }
});

const ServiceProvider = mongoose.model('Provider', providerSchema);

module.exports = ServiceProvider;
