const express = require("express");
const router = express.Router();
const providerController = require("../controller/ServiceProviderController"); // Adjust the path as necessary


router.get("/", providerController.findAll);


router.get("/:id", providerController.findById);


router.post("/", providerController.save);

router.put("/:id", providerController.update);


router.delete("/:id", providerController.deleteById);

module.exports = router;
