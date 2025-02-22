const express = require("express");
const router = express.Router();
const {
  sendRequest,
  getRequestsByUser,
  updateRequestStatus,
  getNotifications,
  markNotificationAsRead,
  getAllRequestsForProviders,
} = require("../controller/requestcontroller");
const { authenticateToken } = require("../security/Auth");


// ✅ Send a service request
router.post("/send",authenticateToken, sendRequest);
router.get("/all-providers", getAllRequestsForProviders);

// ✅ Fetch requests by userId
router.get("/user/:userId", getRequestsByUser);

// ✅ Accept or reject a request
router.post("/update-status", updateRequestStatus);

// ✅ Get user notifications (shows on page refresh)
router.get("/notifications", getNotifications);

// ✅ Mark notification as read
router.put("/notifications/mark-read", markNotificationAsRead);

module.exports = router;
