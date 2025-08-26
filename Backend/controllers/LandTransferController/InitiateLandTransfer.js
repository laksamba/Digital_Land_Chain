import asyncHandler from "express-async-handler";
import Land from "../../models/Land.js";
import Transfer from "../../models/Transfer.js"; // Make sure you have a Transfer model

// @desc    Initiate land transfer
// @route   POST /api/transfer/initiate
// @access  Private
export const initiateLandTransfer = asyncHandler(async (req, res) => {
  const { landId, toAddress, txHash } = req.body;

  console.log("===== Initiate Land Transfer Request =====");
  console.log("Body:", req.body);
  console.log("User:", req.user);

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: "Unauthorized: Missing user ID" });
  }

  if (!landId || !toAddress || !txHash) {
    return res.status(400).json({ error: "Missing landId, toAddress or txHash" });
  }

  // Fetch the land from DB
  const land = await Land.findOne({ landId });
  if (!land) {
    return res.status(404).json({ error: "Land not found" });
  }

  const requestId = land.requestId;
  if (!requestId) {
    return res.status(400).json({ error: "Cannot find requestId for this land. Make sure land is registered on-chain." });
  }

  // Save transfer info to Transfer collection
  const transfer = new Transfer({
  landId,
  fromUser: req.user.userId,
  toUser: toAddress,        // <-- wallet address string
  transactionHash: txHash,  // <-- matches schema
  requestId,
  status: "pending",
});


  const savedTransfer = await transfer.save();

  console.log("Saved Transfer:", savedTransfer);

  res.status(201).json({
    message: "Transfer request initiated successfully",
    transfer: savedTransfer,
  });
});
