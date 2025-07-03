import asyncHandler from "express-async-handler";
import { contract } from "../../utils/Blockchain.js";
import Transfer from "../../models/Transfer.js";

export const approveTransfer = asyncHandler(async (req, res) => {
  const { landId } = req.params;

  try {
    //  Call smart contract
    const tx = await contract.approveTransfer(landId);
    await tx.wait();

    //  Update transfer in DB
    const updatedTransfer = await Transfer.findOneAndUpdate(
      { landId, status: "pending" }, // Find the pending transfer
      {
        status: "approved",
        transactionHash: tx.hash,
        updatedAt: Date.now(),
      },
      { new: true } // Return the updated document
    );

    if (!updatedTransfer) {
      return res.status(404).json({ message: "Pending transfer not found" });
    }

    // Success response
    res.json({
      message: "Transfer approved and status updated in DB",
      txHash: tx.hash,
      transfer: updatedTransfer,
    });

  } catch (err) {
    console.error("Approve Transfer Error:", err.message);
    res.status(500).json({ message: "Approval failed", error: err.message });
  }
});
