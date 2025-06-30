// controllers/AdminController/grantLandOfficer.js
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import { contract } from "../../utils/Blockchain.js";

export const assignLandOfficerRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  // console.log('User found:', user);
  if (!user || !user.walletAddress) {
    return res.status(404).json({ message: "User or wallet address not found" });
  }

  const role = await contract.LAND_OFFICER_ROLE();

  const hasRole = await contract.hasRole(role, user.walletAddress);
  if (hasRole) {
    return res.status(400).json({ message: "User already has LAND_OFFICER_ROLE" });
  }

  try {
    const tx = await contract.grantRole(role, user.walletAddress);
    await tx.wait();

    res.status(200).json({
      message: "LAND_OFFICER_ROLE assigned successfully",
      txHash: tx.hash,
      address: user.walletAddress,
    });
  } catch (err) {
    res.status(500).json({ message: "Role assignment failed", error: err.message });
  }
});
