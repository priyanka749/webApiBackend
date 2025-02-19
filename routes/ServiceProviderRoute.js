const express = require("express");
const router = express.Router();
const providerController = require("../controller/ServiceProviderController");

// Get all providers
router.get("/", providerController.getServiceProviders); // Use getServiceProviders, not findAll

// Get provider by ID
router.get("/:id", providerController.getServiceProviderProfile);

// Update provider profile
router.put("/:id", providerController.updateServiceProviderProfile);

module.exports = router;
