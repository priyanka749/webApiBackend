const express = require("express");
const router = express.Router();
const requestController = require("../controller/requestcontroller");

// Ensure these functions exist in the controller
router.post("/", requestController.createRequest);
router.get("/:id", requestController.getProviderRequests);
router.put("/status", requestController.updateRequestStatus);

module.exports = router;
