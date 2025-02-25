const Request = require("../model/Request");
const Notification = require("../model/Notification");

// ✅ Send a Service Request (Customer → Provider)
const sendRequest = async (req, res) => {
  console.log(req.body)
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }

    const { providerUserId, serviceTitle, message } = req.body;

    if (!providerUserId || !serviceTitle || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRequest = new Request({
      userId: req.user.id, // ✅ Get logged-in user's ID
      providerUserId,
      serviceTitle,
      message,
    });

    await newRequest.save();

    // ✅ Store Notification for Provider
    const notification = new Notification({
      userId: providerUserId,
      message: `🔔 New service request from ${req.user.name} for ${serviceTitle}.`,
    });

    await notification.save(); // ✅ Notification stored in DB

    res.status(201).json({ message: "Request sent successfully!", request: newRequest });
  } catch (error) {
    console.error("❌ Error sending request:", error);
    res.status(500).json({ error: "Failed to send request" });
  }
};

// ✅ Fetch All Requests for All Providers (Admin/Global View)
const getAllRequestsForProviders = async (req, res) => {
  try {
      console.log("Fetching all service requests for providers...");

      // ✅ Find all requests and populate customer & provider details
      const requests = await Request.find()
          .populate("userId", "name email phoneNumber location profileImage",) // ✅ Fetch customer details
          
          .sort({ createdAt: -1 }); // ✅ Show latest requests first

      if (!requests.length) {
          return res.status(404).json({ message: "No service requests found for providers" });
      }

      res.status(200).json(requests);
  } catch (error) {
        console.error("❌ Error fetching all provider requests:", error);
        res.status(500).json({ error: "Error fetching all provider requests" });
    }
  };

// ✅ Fetch Requests by User ID (Customer Dashboard)
const getRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const requests = await Request.find({ userId }).populate("providerUserId", "name email");

    res.status(200).json(requests);
  } catch (error) {
    console.error("❌ Error fetching user requests:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Accept or Reject a Service Request (Provider → Customer)
const updateRequestStatus = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }

    // Ensure the logged-in user is an admin or the provider for the request
    if (!(req.user.role === "Admin" || req.user.id === req.body.providerUserId)) {
      return res.status(403).json({ error: "Unauthorized: You are not authorized to perform this action" });
    }

    const { requestId, status } = req.body;

    if (!requestId || !["Accepted", "Canceled"].includes(status)) {
      return res.status(400).json({ error: "Invalid request ID or status. It must be 'Accepted' or 'Canceled'." });
    }

    // Fetch the request by ID
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // If the logged-in user is an admin, they can change the status
    if (req.user.role === "Admin" || request.providerUserId.toString() === req.user.id) {
      // Update the status of the request
      request.status = status;
      await request.save();

      // ✅ Notify the customer about the provider's decision (Accepted or Canceled)
      const notificationMessage = `🔔 Your service request has been ${status.toLowerCase()} by the provider/admin.`;
      const notification = new Notification({
        userId: request.userId, // Notify the customer who made the request
        message: notificationMessage,
      });
      await notification.save();

      // Return the response to the provider/admin
      res.json({ message: `Request ${status} successfully`, request });
    } else {
      res.status(403).json({ error: "Unauthorized: You do not have permission to update this request." });
    }
  } catch (error) {
    console.error("❌ Error updating request status:", error);
    res.status(500).json({ error: "Error updating request status" });
  }
};
// ✅ Fetch Notifications for Logged-in User (Shows on Page Refresh)
const getNotifications = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }

    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ error: "Error fetching notifications" });
  }
};

// ✅ Mark Notification as Read (After Viewing)
const markNotificationAsRead = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }

    const { notificationId } = req.body;
    if (!notificationId) {
      return res.status(400).json({ error: "Notification ID is required" });
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("❌ Error updating notification:", error);
    res.status(500).json({ error: "Error updating notification" });
  }
};

// ✅ Export All Functions
module.exports = {
  sendRequest,
  getRequestsByUser,
  updateRequestStatus,
  getNotifications,
  markNotificationAsRead,
  getAllRequestsForProviders
};
