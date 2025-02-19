const Request = require("../model/Request");

const mongoose = require("mongoose");


const createRequest = async (req, res) => {
  try {
    const { customerId, providerId, serviceDetails } = req.body;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(customerId) || !mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({ message: "Invalid customerId or providerId" });
    }

    const newRequest = new Request({
      customerId,
      providerId,
      serviceDetails,
    });

    await newRequest.save();
    res.status(201).json({ message: "Request sent successfully", request: newRequest });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Failed to create request" });
  }
};


const getProviderRequests = async (req, res) => {
  try {
    const providerId = req.params.id;
    const requests = await Request.find({ providerId }).populate("customerId", "name email");
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching provider requests:", error);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const updatedRequest = await Request.findByIdAndUpdate(requestId, { status }, { new: true });
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: `Request ${status.toLowerCase()} successfully`, request: updatedRequest });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Failed to update request status" });
  }
};

module.exports = {
  createRequest,
  getProviderRequests,
  updateRequestStatus,
};
