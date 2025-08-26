import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Transfer from "../../models/Transfer.js";


export const getUserTransfers = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.userId;
    console.log("Fetching pending transfers for user:", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID missing in request" });
    }

    // ⚡ Use 'new' with ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const pendingTransfers = await Transfer.find({
      fromUser: userObjectId,
    //   status: "pending",
    })
      .populate("fromUser", "walletAddress email")
      .populate("toUser", "walletAddress email")
      .lean();

    console.log("Pending transfers:", pendingTransfers);
    res.json(pendingTransfers);
  } catch (error) {
    console.error("Error fetching user pending transfers:", error);
    res.status(500).json({
      message: "Failed to fetch pending transfers",
      error: error.message,
    });
  }
});

