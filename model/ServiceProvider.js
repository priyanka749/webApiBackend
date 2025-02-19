const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,  
    unique: true,  // Prevent duplicate phone numbers
    sparse: true,  // Allow multiple documents with `null` value for `phoneNumber`
  },
  bio: {
    type: String,
    required: true,
  },

  profileImage: { 
  type: String },

  rating:{ 
  type: Number, default: 0 },
 
  location: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
});

const ServiceProvider = mongoose.model("Provider", providerSchema);
module.exports = ServiceProvider;
