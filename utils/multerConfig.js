const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Configure Multer to use Cloudinary as storage for service provider profile images
const ServiceProviderStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "service-provider-profile-images", // Cloudinary folder for service provider images
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

const CustomerStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "customer-profile-images", // Cloudinary folder for customer images
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

// Create Multer instances for both service providers and customers
const uploadServiceProvider = multer({ storage: ServiceProviderStorage });
const uploadCustomer = multer({ storage: CustomerStorage });

module.exports = {
  uploadServiceProvider,
  uploadCustomer,
};
