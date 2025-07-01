// controllers/AdminController/assignUserRoleWithBlockchainSupport.js
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import { contract } from "../../utils/Blockchain.js";

export const assignUserRoleWithBlockchain = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const { userId } = req.params;

  if (!role) return res.status(400).json({ message: "Role is required in body" });

  const user = await User.findById(userId);
  if (!user || !user.walletAddress) {
    return res.status(404).json({ message: "User or wallet address not found" });
  }

  // First, update in MongoDB
  user.role = role;
  await user.save();

  // Handle blockchain role assignment only if it's LAND_OFFICER_ROLE
  if (role === "land_officer") {
    try {
      const onChainRole = await contract.LAND_OFFICER_ROLE();
      const alreadyHasRole = await contract.hasRole(onChainRole, user.walletAddress);

      if (!alreadyHasRole) {
        const tx = await contract.grantRole(onChainRole, user.walletAddress);
        await tx.wait();

        return res.status(200).json({
          message: "Role updated in DB and smart contract",
          txHash: tx.hash,
          user,
        });
      }

      return res.status(200).json({
        message: "Role updated in DB. Blockchain role already exists.",
        user,
      });

    } catch (err) {
      return res.status(500).json({
        message: "DB role updated, but blockchain role assignment failed",
        error: err.message,
      });
    }
  }

  // Other roles (bank, survey_officer, citizen, etc.)
  return res.status(200).json({
    message: `Role '${role}' assigned in database only (no blockchain interaction)`,
    user,
  });
});
