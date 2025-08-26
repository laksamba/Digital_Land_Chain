import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Land from "../../models/Land.js";
import { Readable } from "stream";
import { pinata, contract } from "../../utils/Blockchain.js"; // contract needed for requestId

export const submitLandRegistration = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { location, area, landId, requestId } = req.body; // get requestId from frontend
  const files = req.files;

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: "Unauthorized: Missing user ID" });
  }

  const ownerDetails = {
    userId: req.user.userId.toString(),
    ethAddress: req.user.ethAddress,
  };

  let ipfsDocuments = [];

  if (files && files.length > 0) {
    for (const file of files) {
      const stream = Readable.from(file.buffer);
      stream.path = file.originalname;

      const result = await pinata.pinFileToIPFS(stream, {
        pinataMetadata: { name: file.originalname },
      });

      ipfsDocuments.push(result.IpfsHash);
    }
  }

  // Prepare metadata
  const metadata = { owner: ownerDetails, location, area, documentCIDs: ipfsDocuments };

  // Save to MongoDB
  const land = new Land({
    owner: req.user.userId,
    landId,
    location,
    area,
    ipfsDocuments,
    status: "pending",
    requestId, // save the requestId from frontend
    landHash: JSON.stringify(metadata), // optional: store metadata hash
  });

  const savedLand = await land.save();
  console.log("Saved land:", savedLand);

  res.status(201).json({
    message: "Land registration submitted",
    requestId,
    land: savedLand,
  });
});
