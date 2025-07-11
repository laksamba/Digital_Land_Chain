import mongoose from "mongoose";
import Land from "../../models/Land.js";

export const getLandWithOwnerDetails = async (req, res) => {
  const userId = req.params.id;
  console.log("→ getLandWithOwnerDetails called with userId:", userId);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.warn("Invalid ObjectId:", userId);
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const lands = await Land.find({ owner: userId }).populate("owner");
    console.log("→ lands fetched:", lands);

    if (!lands || lands.length === 0) {
      return res.status(404).json({ message: "No lands found for this user" });
    }
    res.status(200).json(lands);
  } catch (err) {
    console.error("Error fetching lands:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
