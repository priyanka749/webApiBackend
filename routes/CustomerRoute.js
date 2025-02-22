const express = require("express");
const router = express.Router();
// const upload = require("../middleware/uploads"); // Import Multer middleware
const customerController = require("../controller/CustomerController");
const { updateCustomerProfile } = require("../controller/CustomerController");
const multer = require("multer");
const upload = require("../middleware/uploads"); 

// ✅ Fetch all customers

router.get("/", customerController.getAllCustomers);
router.get("/profile/:id", customerController.getCustomerProfile);
// router.put("/:id", upload.single("Image"), customerController.updateCustomerProfile);
// const upload = multer({ dest: "public/uploads/" });

// Ensure route is correct
router.put("/profile/:userId", upload.single("profileImage"), updateCustomerProfile);



module.exports = router;
