const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads"); 
const { addService, getAllServices, getProviderServices } = require("../controller/ServiceController");

// ✅ Add a new service
router.post("/add", upload.single("image"), addService);

// ✅ Get all services
router.get("/", getAllServices);

// ✅ Get services for a specific provider
router.get("/:userId", getProviderServices); // ✅ Corrected param

module.exports = router;
