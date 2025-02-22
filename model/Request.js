const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ Customer's userId
    required: true,
  },
  providerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ Service provider's userId
    required: true,
  },
  serviceDetails: {
    type: String,
    required: false,
  },
  message: {
    type: String, // Optional message from customer
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;
