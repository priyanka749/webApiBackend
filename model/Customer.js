const mongoose = require("mongoose");
const { Schema } = mongoose;

// const customerSchema = new Schema({
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: "Users",
//         required: true,
//     },
//     name: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     location: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     profileImage: { 
//     type: String },
// });

// const Customer = mongoose.model("customers", customerSchema);
// module.exports = Customer;

const customerSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Change "users" to "User" to match the model name in your User model
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      
    },
    email: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
        type: String,  
        unique: true,  // Prevent duplicate phone numbers
        sparse: true,  // Allow multiple documents with `null` value for `phoneNumber`
      },

    profileImage: {
      type: String,
    },
  });
  
  const Customer = mongoose.model("Customer", customerSchema); // Use "Customer" as the model name for consistency
  module.exports = Customer;
  