// Import the Provider model
const Provider = require("../model/ServiceProvider");

// Find all providers
const findAll = async (req, res) => {
    try {
        const providers = await Provider.find();
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Find provider by ID
const findById = async (req, res) => {
    try {
        const provider = await Provider.findById(req.params.id);
        if (!provider) {
            return res.status(404).json({ message: "Provider not found" });
        }
        res.status(200).json(provider);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Save a new provider
const save = async (req, res) => {
    console.log("Request Body:", req.body);
    try {
        const { user_id, business_name, description, rating, services_offered, name, email, phoneNumber, category, password } = req.body;
        const provider = new Provider({ user_id, business_name, description, rating, services_offered, name, email, phoneNumber, category, password });

        await provider.save();
        console.log("Provider Saved:", provider);

        res.status(201).json(provider);
    } catch (error) {
        console.error("Error saving provider:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email or phone number already exists" });
        }
        res.status(400).json({ message: error.message });
    }
};

// Update a provider by ID
const update = async (req, res) => {
    try {
        const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!provider) {
            return res.status(404).json({ message: "Provider not found" });
        }
        res.status(200).json(provider);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a provider by ID
const deleteById = async (req, res) => {
    try {
        const provider = await Provider.findByIdAndDelete(req.params.id);
        if (!provider) {
            return res.status(404).json({ message: "Provider not found" });
        }
        res.status(200).json({ message: "Provider deleted successfully" });
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