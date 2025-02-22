const fs = require("fs");
const path = require("path");
const ServiceProvider = require("../model/ServiceProvider");
const User = require("../model/User");

// ✅ Fetch all service providers
const getServiceProviders = async (req, res) => {
  try {
    const { skill } = req.query;
    const query = {};
    if (skill) query.skills = { $in: [skill] };

    const providers = await ServiceProvider.find(query)
      .populate("userId", "name email phoneNumber");

    // ✅ Handle cases where userId is null
    const formattedProviders = providers
      .filter(provider => provider.userId) // Exclude null userId records
      .map((provider) => ({
        id: provider._id,
        name: provider.userId?.name || "Unknown",  // ✅ Handle null safely
        email: provider.userId?.email || "No Email",
        phoneNumber: provider.phoneNumber || provider.userId?.phoneNumber || "N/A",
        bio: provider.bio,
        profileImage: provider.profileImage ? `/uploads/${provider.profileImage}` : null,
        location: provider.location,
        skills: provider.skills,
      }));

    res.status(200).json({ providers: formattedProviders });
  } catch (error) {
    console.error("Error fetching service providers:", error);
    res.status(500).json({ message: "Failed to fetch service providers" });
  }
};

// ✅ Fetch specific service provider profile
const getServiceProviderProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Received User ID:", userId); // Debugging log

    const provider = await ServiceProvider.findOne({ userId })
      .populate("userId", "name email phone_number");

    if (!provider) {
      console.log("Provider not found for ID:", userId);
      return res.status(404).json({ message: "Service provider profile not found" });
    }

    res.status(200).json({
      id: provider._id,
      name: provider.userId.name,
      email: provider.userId.email,
      phoneNumber: provider.phoneNumber || provider.userId.phone_number || "N/A",
      bio: provider.bio,
      profileImage: provider.profileImage ? `/uploads/${provider.profileImage}` : null,
      location: provider.location,
      skills: provider.skills,
    });
  } catch (error) {
    console.error("Error fetching service provider profile:", error);
    res.status(500).json({ message: "Failed to fetch service provider profile" });
  }
};

// ✅ Update service provider profile
const updateServiceProviderProfile = async (req, res) => {
  try {
    console.log("✅ Received profile update request for:", req.params.id);
    console.log("✅ Received file:", req.file ? req.file.filename : "No file uploaded");

    const providerId = req.params.id;
    const { name, phoneNumber, bio, location, skills } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (bio) updateFields.bio = bio;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;
    if (location) updateFields.location = location;
    if (skills) updateFields.skills = skills.split(",");

    // ✅ Fix Image Path Issue
    if (req.file) {
      let filePath = req.file.path.replace(/\\/g, "/"); // Fix Windows path issue
      filePath = filePath.replace("public/", ""); // Store correct relative path
      updateFields.profileImage = `/${filePath}`;
    }

    const updatedProvider = await ServiceProvider.findOneAndUpdate(
      { userId: providerId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedProvider) {
      console.log("❌ Provider not found for ID:", providerId);
      return res.status(404).json({ message: "Service provider not found" });
    }

    console.log("✅ Profile updated successfully:", updatedProvider);
    res.status(200).json({
      message: "Profile updated successfully",
      provider: updatedProvider,
    });

  } catch (error) {
    console.error("❌ Error updating service provider profile:", error);
    res.status(500).json({ message: "Failed to update service provider profile", error: error.message });
  }
};

// ✅ Export all functions
module.exports = {
  getServiceProviders,
  getServiceProviderProfile,
  updateServiceProviderProfile,
};
