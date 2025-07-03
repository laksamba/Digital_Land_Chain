
import asyncHandler from "express-async-handler";
import { contract } from "../../utils/Blockchain.js";

export const verifyCertificate = asyncHandler(async (req, res) => {
  const { landId, inputHash } = req.body;

  try {
    const valid = await contract.verifyCertificate(landId, inputHash);
    res.json({ valid });
  } catch (err) {
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
});
