// controllers/transferController.js
import asyncHandler from "express-async-handler";
import Transfer from "../../models/Transfer.js";
import Land from "../../models/Land.js";

export const getAllTransfers = asyncHandler(async (req, res) => {
  try {
    // Fetch all transfers (any status)
    const transfers = await Transfer.find().lean();

    if (!transfers || transfers.length === 0) {
      return res.json([]);
    }

    // Attach land details
    const populatedTransfers = await Promise.all(
      transfers.map(async (t) => {
        let landDetails = {
          location: "Unknown",
          size: "N/A",
          description: "N/A",
        };

        if (t.landId) {
          try {
            const land = await Land.findById(t.landId).lean();
            if (land) {
              landDetails = {
                location: land.location || "Unknown",
                size: land.size || "N/A",
                description: land.description || "N/A",
              };
            }
          } catch (err) {
            console.warn(`⚠️ Could not fetch land for transfer ${t._id}:`, err.message);
          }
        }

        return {
          _id: t._id,
          landId: t.landId,
          senderAddress: t.senderAddress,
          receiverAddress: t.receiverAddress,
          status: t.status,   // pending | approved | rejected
          landDetails,
        };
      })
    );

    res.json(populatedTransfers);
  } catch (err) {
    console.error("🔥 Error fetching transfers:", err.message);
    res.status(500).json({ message: "Failed to fetch transfers", error: err.message });
  }
});

