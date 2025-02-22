const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads"); // Ensure this is correct
const providerController = require("../controller/ServiceProviderController");

// ✅ Fetch all providers
router.get("/", providerController.getServiceProviders);

// ✅ Fetch specific provider profile
router.get("/profile/:id", providerController.getServiceProviderProfile);

// ✅ Update provider profile (Fix Multer usage!)
router.put("/:id", upload.single("profileImage"), providerController.updateServiceProviderProfile);

module.exports = router;
