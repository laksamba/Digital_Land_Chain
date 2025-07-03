
import asyncHandler from "express-async-handler";
import { contract } from "../../utils/Blockchain.js";

export const getLandDetails = asyncHandler(async (req, res) => {
  const { landId } = req.params;

  try {
    const land = await contract.getLand(landId);
    res.json({
      owner: land[0],
      isVerified: land[1],
      landHash: land[2],
    });
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch land", error: err.message });
  }
});
