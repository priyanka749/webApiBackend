const Provider = require("../model/ServiceProvider");

const findAll = async (req, res) => {
    try {
        const providers = await Provider.find();
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


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

const save = async (req, res) => {
    try {
        const { userId, bio, rating,location, image } = req.body;

        const provider = new Provider({ userId, bio, rating, location, image });

        await provider.save();
        res.status(201).json(provider);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Duplicate entry: " + error.message });
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
