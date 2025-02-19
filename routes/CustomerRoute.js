const express = require("express");
const router = express.Router();
const { getAllCustomers, getCustomerProfile, updateCustomerProfile } = require("../controller/CustomerController");

// Route to get all customers
router.get("/", getAllCustomers);

// Route to get a single customer profile by userId or ObjectId
router.get("/profile/:id", getCustomerProfile);

// Route to update a customer profile by userId or ObjectId
router.put("/profile/:id", updateCustomerProfile);

module.exports = router;
