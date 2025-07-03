import asyncHandler from "express-async-handler";
import { contract } from "../../utils/Blockchain.js";
import Transfer from "../../models/Transfer.js";
import User from "../../models/User.js";

export const finalizeTransfer = asyncHandler(async (req, res) => {
  const { landId } = req.params;

  try {
    // Finalize transfer on blockchain
    const tx = await contract.finalizeTransfer(landId);
    const receipt = await tx.wait();

    // Get new owner from smart contract
    const land = await contract.lands(landId);
    const newOwnerWallet = land.owner.toLowerCase();

    // Find users in database
    const toUser = await User.findOne({ walletAddress: newOwnerWallet });
    const fromUser = await User.findOne({ walletAddress: req.user?.walletAddress?.toLowerCase() });

    // Find and update the pending transfer record
    const updatedTransfer = await Transfer.findOneAndUpdate(
      { landId: landId.toString(), status: "pending" },
      {
        fromUser: fromUser?._id || null,
        toUser: toUser?._id || null,
        transactionHash: tx.hash,
        status: "completed",
        finalizedAt: new Date(),
      },
      { new: true }
    );

    // If no pending transfer, fallback to create (optional)
    if (!updatedTransfer) {
      await Transfer.create({
        landId: landId.toString(),
        fromUser: fromUser?._id || null,
        toUser: toUser?._id || null,
        transactionHash: tx.hash,
        status: "completed",
        finalizedAt: new Date(),
      });
    }

    res.json({ message: "Ownership transferred successfully", txHash: tx.hash });
  } catch (err) {
    console.error("Finalize Transfer Error:", err.message);
    res.status(500).json({ message: "Finalization failed", error: err.message });
  }
});
