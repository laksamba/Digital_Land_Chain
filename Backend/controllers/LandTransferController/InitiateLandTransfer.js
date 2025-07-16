import asyncHandler from "express-async-handler";
import { contract } from "../../utils/Blockchain.js";
import Transfer from "../../models/Transfer.js";
import User from "../../models/User.js";

export const initiateLandTransfer = asyncHandler(async (req, res) => {
  const { landId, toAddress } = req.body;
  console.log("Initiate Land Transfer Request:", req.body);

  if (!landId || !toAddress) {
    return res.status(400).json({ message: "landId and toAddress are required" });

  }

   if (!req.user || !req.user.walletAddress) {
    return res.status(401).json({ message: "Unauthorized: Missing user address" });
  }

  try {

     // ✅ Check if a pending transfer already exists for the landId
    const existingTransfer = await Transfer.findOne({ landId: landId.toString(), status: 'pending' });

    if (existingTransfer) {
      return res.status(409).json({ message: "A pending transfer already exists for this landId." });
    }
    
    // Interact with smart contract
    const tx = await contract.initiateTransfer(landId, toAddress);
    await tx.wait();

    // Get user info from decoded JWT
   const fromUser = await User.findOne({ walletAddress: req.user.walletAddress.toLowerCase() });
   console.log(fromUser, "fromUser");
if (!fromUser) {
  return res.status(404).json({ message: "Sender not found in DB." });
}

const toUser = await User.findOne({ walletAddress: toAddress });
console.log(toUser, "toUser");
if (!toUser) {
  return res.status(404).json({ message: "Recipient wallet address not registered." });
}

    // Save to MongoDB
    await Transfer.create({
      landId: landId.toString(),
      fromUser: fromUser?._id || null,
      toUser: toUser?._id || null,
      transactionHash: tx.hash,
      status: 'pending',
    });

    res.json({ message: "Transfer initiated and saved to DB", txHash: tx.hash });
  } catch (err) {
    console.error("Initiate Transfer Error:", err.message);
    res.status(500).json({ message: "Transfer initiation failed", error: err.message });
  }
});
