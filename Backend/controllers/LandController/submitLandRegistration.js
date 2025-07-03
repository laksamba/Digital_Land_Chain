import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import { ethers } from "ethers";
import Land from "../../models/Land.js";
import { Readable } from "stream";
import { pinata, contract } from "../../utils/Blockchain.js";

export const submitLandRegistration = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { location, area,landId } = req.body;
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
        pinataMetadata: {
          name: file.originalname,
        },
      });
      ipfsDocuments.push(result.IpfsHash);
    }
  }

  // 📝 Prepare metadata and hash
  const metadata = { owner: ownerDetails, location, area, documentCIDs: ipfsDocuments };
  let landHash;

  try {
    const metadataString = JSON.stringify(metadata);
    landHash = ethers.keccak256(ethers.toUtf8Bytes(metadataString));
  } catch (err) {
    return res.status(500).json({ message: 'Metadata hashing failed', error: err.message });
  }

  // 📦 Submit to Blockchain
  let requestId;
  try {
    const tx = await contract.submitRegistrationRequest(landHash);
    const receipt = await tx.wait();
    const event = receipt.logs
      .map((log) => contract.interface.parseLog(log))
      .find((e) => e?.name === 'RegistrationRequested');

    requestId = event?.args.requestId.toString();
  } catch (err) {
    return res.status(500).json({ message: 'Blockchain submit failed', error: err.message });
  }

  //  Save to MongoDB
  const land = new Land({
    owner: req.user.userId, 
    landId,
    location,
    area,
    ipfsDocuments,
    status: 'pending',
    requestId,
    landHash,
  });

  const savedLand = await land.save();

  res.status(201).json({
    message: 'Land registration submitted',
    requestId,
    land: savedLand,
  });
});
