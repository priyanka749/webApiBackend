const mongoose = require('mongoose');
const Customer = require("../model/Customer");



// Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single customer profile by userId or ObjectId (_id)
const getCustomerProfile = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from request params
        console.log("Fetching customer profile for ID:", id);

        // Ensure ID is provided
        if (!id) {
            console.error("Error: ID is missing in request.");
            return res.status(400).json({ message: "ID parameter is required." });
        }

        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        // Correctly instantiate ObjectId using 'new'
        const objectId = new mongoose.Types.ObjectId(id);

        // Query the customer by _id or userId
        const customer = await Customer.findOne({
            $or: [
                { _id: objectId }, // Query by _id
                { userId: objectId } // Query by userId
            ]
        });

        if (!customer) {
            console.error("Customer not found for ID:", id);
            return res.status(404).json({ message: "Customer not found." });
        }

        console.log("Customer profile found:", customer);
        res.status(200).json(customer);
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
};


// Update customer profile by userId or ObjectId (_id)
const updateCustomerProfile = async (req, res) => {
    try {
        const { id } = req.params; // Get ID from request params
        const updateData = req.body; // Data to be updated

        // Find the customer by userId or _id and update the profile
        const updatedCustomer = await Customer.findOneAndUpdate(
            { $or: [{ _id: id }, { userId: id }] },
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ message: "Customer updated successfully", updatedCustomer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllCustomers, getCustomerProfile, updateCustomerProfile };
