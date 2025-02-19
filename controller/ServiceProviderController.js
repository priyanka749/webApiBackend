const ServiceProvider = require("../model/ServiceProvider");
const User = require("../model/User");
const cloudinary = require("../utils/cloudinary");

// Fetch all service providers with filters and pagination
const getServiceProviders = async (req, res) => {
  try {
    const { skill, minRating, maxRating } = req.query;

    const query = {};
    if (skill) query.skills = { $in: [skill] };
    if (minRating) query.rating = { ...query.rating, $gte: Number(minRating) };
    if (maxRating) query.rating = { ...query.rating, $lte: Number(maxRating) };

    const providers = await ServiceProvider.find(query)
      .populate("userId", "name email phoneNumber"); // Populate related user details

    const formattedProviders = providers.map((provider) => ({
      id: provider._id,
      name: provider.name,
      email: provider.email,
      phoneNumber: provider.phoneNumber,
      bio: provider.bio,
      profileImage: provider.profileImage,
      rating: provider.rating,
      location: provider.location,
      skills: provider.skills,
    }));

    res.status(200).json(formattedProviders);
  } catch (error) {
    console.error("Error fetching service providers:", error);
    res.status(500).json([]);
  }
};


// Fetch specific service provider profile
const getServiceProviderProfile = async (req, res) => {
  try {
    const providerId = req.params.id;
    console.log("Fetching provider with ID:", providerId);  // Debugging log

    const provider = await ServiceProvider.findById(providerId).populate("userId", "name email phoneNumber");
    if (!provider) {
      console.log("Provider not found for ID:", providerId);
      return res.status(404).json({ message: "Service provider profile not found" });
    }

    const profile = {
      id: provider._id,
      name: provider.name,
      email: provider.email,
      phoneNumber: provider.phoneNumber,
      bio: provider.bio,
      profileImage: provider.profileImage,
      rating: provider.rating,
      location: provider.location,
      skills: provider.skills,
    };

    res.status(200).json({
      message: "Service provider profile fetched successfully",
      provider: profile,
    });
  } catch (error) {
    console.error("Error fetching service provider profile:", error);
    res.status(500).json({ message: "Failed to fetch service provider profile" });
  }
};

// Update service provider profile
const updateServiceProviderProfile = async (req, res) => {
  try {
    const providerId = req.user.id; // Get authenticated provider ID from token
    const { name, bio, location, skills } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (bio) updateFields.bio = bio;
    if (location) updateFields.location = location;
    if (skills) updateFields.skills = skills;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "provider-profile-images",
      });
      updateFields.profileImage = uploadResult.secure_url;
    }

    const updatedProvider = await ServiceProvider.findOneAndUpdate(
      { userId: providerId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedProvider) {
      return res.status(404).json({ message: "Service provider not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      provider: updatedProvider,
    });
  } catch (error) {
    console.error("Error updating service provider profile:", error);
    res.status(500).json({ message: "Failed to update service provider profile" });
  }
};

module.exports = {
    getServiceProviders,  // This corresponds to `findAll`
    getServiceProviderProfile,
    updateServiceProviderProfile,
  };
