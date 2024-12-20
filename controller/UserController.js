const User = require("../model/User");


const findAll = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const findById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const save = async (req, res) => {
    console.log("Request Body:", req.body);
    try {
        const { name, email, phone_number, location, password } = req.body;
        const user = new User({ name, email, phone_number, location, password });

        await user.save();
        console.log("User Saved:", user);

        res.status(201).json(user);
    } catch (error) {
        console.error("Error saving user:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email or phone number already exists" });
        }
        res.status(400).json({ message: error.message });
    }
};



const update = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }); 
        if (!user) {
            return res.status(404).json({ message: "User not found" }); 
        }
        res.status(200).json(user); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

// Delete a user by ID
const deleteById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id); 
        if (!user) {
            return res.status(404).json({ message: "User not found" }); 
        }
        res.status(200).json({ message: "User deleted successfully" }); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

module.exports = {
    findAll,
    findById,
    save,
    update,
    deleteById,
};
