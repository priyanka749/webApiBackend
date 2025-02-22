const Service = require("../model/Service");
const Provider = require("../model/ServiceProvider");

// ✅ Add a new service
const addService = async (req, res) => {
    try {
        const { userId, title, description, skills } = req.body;

        // Ensure provider exists
        const provider = await Provider.findOne({ userId }); // Match by userId
        if (!provider) {
            return res.status(404).json({ message: "Provider not found" });
        }

        // Create service entry
        const service = new Service({
            userId, // ✅ Store userId (consistent)
            title,
            description,
            skills: Array.isArray(skills) ? skills : skills.split(","), // ✅ Ensure array format
            image: req.file ? `/uploads/${req.file.filename}` : "",
        });

        await service.save();

        // Add service ID to provider's services array
        provider.services.push(service._id);
        await provider.save();

        res.status(201).json({ message: "Service added successfully", service });
    } catch (error) {
        console.error("❌ Error adding service:", error);
        res.status(500).json({ message: "Error adding service", error: error.message });
    }
};

// ✅ Get all services
const getAllServices = async (req, res) => {
    try {
        console.log("Fetching all services...");
        const services = await Service.find().populate("userId", "name email"); // ✅ Use userId
        if (!services.length) {
            return res.status(404).json({ message: "No services found" });
        }
        res.status(200).json(services);
    } catch (error) {
        console.error("❌ Error fetching services:", error);
        res.status(500).json({ message: "Error fetching services", error: error.message });
    }
};

// ✅ Get services by provider
const getProviderServices = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("Fetching services for provider:", userId);

        const services = await Service.find({ userId });

        if (!services.length) {
            return res.status(404).json({ message: "No services found for this provider" });
        }

        res.status(200).json(services);
    } catch (error) {
        console.error("❌ Error fetching provider's services:", error);
        res.status(500).json({ message: "Error fetching provider's services", error: error.message });
    }
};

module.exports = { addService, getAllServices, getProviderServices };
