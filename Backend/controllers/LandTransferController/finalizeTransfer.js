import asyncHandler from "express-async-handler";
import { contract, provider } from "../../utils/Blockchain.js";
import Transfer from "../../models/Transfer.js";
import User from "../../models/User.js";
import Land from "../../models/Land.js";
import { ethers } from "ethers";

export const finalizeTransfer = asyncHandler(async (req, res) => {
  const { landId, txHash, fromWallet } = req.body;

  try {
    // Validate input
    if (!landId || !txHash || !fromWallet) {
      return res.status(400).json({ message: "landId, txHash, and fromWallet are required" });
    }
    // if (!ethers.utils.isAddress(fromWallet)) {
    //   return res.status(400).json({ message: "Invalid fromWallet address" });
    // }
    // if (!txHash.match(/^0x[a-fA-F0-9]{64}$/)) {
    //   return res.status(400).json({ message: "Invalid txHash format" });
    // }

    // Validate land existence
    const landExists = await Land.findOne({ landId: landId.toString() });
    if (!landExists) {
      return res.status(404).json({ message: "Land not found" });
    }

    // Get transfer details from smart contract
    // const transfer = await contract.transfers(landId);
    // if (transfer.to === ethers.constants.AddressZero) {
    //   return res.status(404).json({ message: "No pending transfer found" });
    // }

    // // Verify requester is the intended recipient
    // if (transfer.to.toLowerCase() !== req.user.walletAddress.toLowerCase()) {
    //   return res.status(403).json({ message: "Only the intended recipient can finalize the transfer" });
    // }

    // // Verify fromWallet matches the transfer's from address
    // if (transfer.from.toLowerCase() !== fromWallet.toLowerCase()) {
    //   return res.status(400).json({ message: "Provided fromWallet does not match transfer initiator" });
    // }

    // Lock the land
    const land = await Land.findOneAndUpdate(
      { landId: landId.toString(), transferStatus: { $ne: "pending" } },
      { transferStatus: "pending" },
      { new: true }
    );
    if (!land) {
      return res.status(409).json({ message: "Transfer already in progress" });
    }

    // Verify transaction
    // const receipt = await provider.getTransactionReceipt(txHash);
    // if (!receipt || receipt.status !== 1) {
    //   await Land.findOneAndUpdate(
    //     { landId: landId.toString() },
    //     { transferStatus: null }
    //   );
    //   return res.status(400).json({ message: "Invalid or failed transaction" });
    // }

    // Get new owner from blockchain
    // const updatedLand = await contract.lands(landId);
    const newOwnerWallet = req.user.walletAddress.toLowerCase(); //updatedLand.owner.toLowerCase();

    // Verify ownership changed
    if (newOwnerWallet === fromWallet.toLowerCase()) {
      await Land.findOneAndUpdate(
        { landId: landId.toString() },
        { transferStatus: null }
      );
      return res.status(400).json({ message: "Transfer failed: Ownership unchanged" });
    }

    // Update database
    const toUser = await User.findOne({ walletAddress: newOwnerWallet });
    const fromUser = await User.findOne({ walletAddress: fromWallet.toLowerCase() });

    console.log("Old owner wallet:", fromWallet);
    console.log("New owner wallet:", newOwnerWallet);
    console.log("Requester wallet:", req.user.walletAddress.toLowerCase());

    const updatedLandRecord = await Land.findOneAndUpdate(
      { landId: landId.toString() },
      {
        owner: toUser?._id || null,
        ownerWallet: newOwnerWallet,
        updatedAt: new Date(),
        transferStatus: null,
      },
      { new: true }
    );
    console.log("Updated land record: {landId}: ", updatedLandRecord);

    const updatedTransfer = await Transfer.findOneAndUpdate(
      { landId: landId.toString(), status: "pending" },
      {
        fromUser: fromUser?._id || null,
        toUser: toUser?._id || null,
        transactionHash: txHash,
        status: "completed",
        finalizedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedTransfer) {
      await Transfer.create({
        landId: landId.toString(),
        fromUser: fromUser?._id || null,
        toUser: toUser?._id || null,
        transactionHash: txHash,
        status: "completed",
        finalizedAt: new Date(),
      });
    }

    res.json({ message: "Ownership transferred successfully", txHash });
  } catch (err) {
    console.error("Error in finalizeTransfer:", err);
    await Land.findOneAndUpdate(
      { landId: landId.toString() },
      { transferStatus: null }
    );
    res.status(500).json({ message: "Finalization failed", error: err.message });
  }
});