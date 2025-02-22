// const mongoose = require('mongoose');
// const Customer = require("../model/Customer");



// // Get all customers
// const getAllCustomers = async (req, res) => {
//     try {
//         const customers = await Customer.find();
//         res.status(200).json(customers);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get a single customer profile by userId or ObjectId (_id)
// const getCustomerProfile = async (req, res) => {
//     try {
//         const { id } = req.params; // Get the ID from request params
//         console.log("Fetching customer profile for ID:", id);

//         // Ensure ID is provided
//         if (!id) {
//             console.error("Error: ID is missing in request.");
//             return res.status(400).json({ message: "ID parameter is required." });
//         }

//         // Check if the ID is a valid MongoDB ObjectId
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "Invalid ID format." });
//         }

//         // Correctly instantiate ObjectId using 'new'
//         const objectId = new mongoose.Types.ObjectId(id);

//         // Query the customer by _id or userId
//         const customer = await Customer.findOne({
//             $or: [
//                 { _id: objectId }, // Query by _id
//                 { userId: objectId } // Query by userId
//             ]
//         });

//         if (!customer) {
//             console.error("Customer not found for ID:", id);
//             return res.status(404).json({ message: "Customer not found." });
//         }

//         console.log("Customer profile found:", customer);
//         res.status(200).json(customer);
//     } catch (error) {
//         console.error("Error fetching profile:", error.message);
//         res.status(500).json({ message: "Internal server error. Please try again later." });
//     }
// };


// // Update customer profile by userId or ObjectId (_id)
// const updateCustomerProfile = async (req, res) => {
//     try {
//         const { id } = req.params; // Get ID from request params
//         const updateData = req.body; // Data to be updated

//         // Find the customer by userId or _id and update the profile
//         const updatedCustomer = await Customer.findOneAndUpdate(
//             { $or: [{ _id: id }, { userId: id }] },
//             updateData,
//             { new: true } // Return the updated document
//         );

//         if (!updatedCustomer) {
//             return res.status(404).json({ message: "Customer not found" });
//         }

//         res.status(200).json({ message: "Customer updated successfully", updatedCustomer });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// module.exports = { getAllCustomers, getCustomerProfile, updateCustomerProfile };


const mongoose = require("mongoose");
const Customer = require("../model/Customer");
const fs = require("fs");
const path = require("path");

// ✅ Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error.message);
        res.status(500).json({ message: "Failed to fetch customers." });
    }
};

// ✅ Get a single customer profile by userId or _id
const getCustomerProfile = async (req, res) => {
    try {
        const { id } = req.params; // Get customer ID
        console.log("Fetching customer profile for ID:", id);

        if (!id) {
            return res.status(400).json({ message: "ID parameter is required." });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        const objectId = new mongoose.Types.ObjectId(id);

        const customer = await Customer.findOne({
            $or: [{ _id: objectId }, { userId: objectId }]
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        console.log("Customer profile found:", customer);
        res.status(200).json({
            id: customer._id,
            userId: customer.userId,
            name: customer.name,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            location: customer.location,
            profileImage: customer.profileImage ? `/uploads/${customer.profileImage}` : null,
        });
    } catch (error) {
        console.error("Error fetching customer profile:", error.message);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
};

// // ✅ Update customer profile (supports image upload)
// const updateCustomerProfile = async (req, res) => {
//     try {
//         console.log("Received profile update request for:", req.params.id);
//         console.log("Received file:", req.file ? req.file.filename : "No file uploaded");

//         const { id } = req.params;
//         const { name, email, phoneNumber, location } = req.body;
        
//         const updateFields = {};
//         if (name) updateFields.name = name;
//         if (email) updateFields.email = email;
//         if (phoneNumber) updateFields.phoneNumber = phoneNumber;
//         if (location) updateFields.location = location;

//         // ✅ Handle Image Upload
//         if (req.file) {
//             let filePath = req.file.path.replace(/\\/g, "/"); // Fix Windows path issue
//             filePath = filePath.replace("public/", ""); // Ensure correct relative path
//             updateFields.profileImage = `/${filePath}`;
//         }

//         const updatedCustomer = await Customer.findOneAndUpdate(
//             { $or: [{ _id: id }, { userId: id }] },
//             { $set: updateFields },
//             { new: true }
//         );

//         if (!updatedCustomer) {
//             return res.status(404).json({ message: "Customer not found." });
//         }

//         console.log("✅ Customer profile updated successfully:", updatedCustomer);
//         res.status(200).json({
//             message: "Customer profile updated successfully.",
//             customer: updatedCustomer
//         });
//     } catch (error) {
//         console.error("❌ Error updating customer profile:", error.message);
//         res.status(500).json({ message: "Failed to update customer profile.", error: error.message });
//     }
// };

// module.exports = { getAllCustomers, getCustomerProfile, updateCustomerProfile };
// // 



// ✅ Update customer profile (supports image upload)
// Ensure multer is imported

// Configure Multer storage

const updateCustomerProfile = async (req, res) => {
    try {
        const { userId } = req.params;  // Get userId from URL
        const { name, location, phoneNumber } = req.body;

        console.log("Updating profile for user:", userId);

        // ✅ Find customer by either userId or _id
        let customer = await Customer.findOne({ $or: [{ userId: userId }, { _id: userId }] });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // ✅ Preserve existing email so it is not removed
        const email = customer.email;

        // ✅ Update only provided fields
        if (name) customer.name = name;
        if (location) customer.location = location;
        if (phoneNumber) customer.phoneNumber = phoneNumber;

        // ✅ Fix profile image path issue (Ensure single `/uploads/`)
        if (req.file) {
            customer.profileImage = `/uploads/${req.file.filename}`;
        }

        customer.email = email; // Ensure email remains unchanged

        await customer.save({ validateBeforeSave: false });

        console.log("✅ Profile updated successfully:", customer);
        res.json({
            message: "Profile updated successfully!",
            customer: {
                id: customer._id,
                userId: customer.userId,
                name: customer.name,
                location: customer.location,
                phoneNumber: customer.phoneNumber,
                profileImage: customer.profileImage ? customer.profileImage : null,
            }
        });

    } catch (error) {
        console.error("❌ Update Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


// exports.updateCustomerProfile = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const { name, location, phoneNumber } = req.body;

//         console.log("Updating profile for user:", userId);

//         let customer = await Customer.findOne({ userId: userId });
//         if (!customer) {
//             return res.status(404).json({ message: "Customer not found" });
//         }

//         customer.name = name || customer.name;
//         customer.location = location || customer.location;
//         customer.phoneNumber = phoneNumber || customer.phoneNumber;

//         if (req.file) {
//             customer.profileImage = req.file.path;
//         }

//         await customer.save();
//         console.log("Profile updated:", customer);
//         res.json({ message: "Profile updated successfully!", customer });
//     } catch (error) {
//         console.error("Update Error:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

module.exports = { getAllCustomers, getCustomerProfile
, updateCustomerProfile};
// module.exports = { getAllCustomers, getCustomerProfile, updateCustomerProfile };