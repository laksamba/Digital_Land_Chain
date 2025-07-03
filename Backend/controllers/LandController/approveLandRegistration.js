import asyncHandler from "express-async-handler";
import Land from "../../models/Land.js";
import { contract, pinata } from "../../utils/Blockchain.js";

export const approveLandRegistration = asyncHandler(async (req, res) => {
  console.log('Request body:', req.body);
  const { id } = req.params;
  const { status, requestId } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const land = await Land.findById(id).populate('owner');
  if (!land) {
    return res.status(404).json({ message: 'Land not found' });
  }

  if (land.status !== 'pending') {
    return res.status(400).json({ message: 'Land already processed' });
  }

  land.status = status;

  if (status === 'rejected') {
    land.tempDocuments = [];
    await land.save();
    return res.status(200).json({ message: 'Land registration rejected' });
  }

  // Prepare metadata to upload to IPFS via Pinata
  const metadata = {
    owner: {
      userId: land.owner._id.toString(),
      ethAddress: land.owner.ethAddress,
    },
    location: land.location,
    area: land.area,
    documentCIDs: land.ipfsDocuments,
  };

  let ipfsMetaCid;
  try {
    const result = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: {
        name: `land-meta-${land._id.toString()}`
      }
    });
    ipfsMetaCid = result.IpfsHash;
  } catch (error) {
    return res.status(500).json({ message: 'Metadata upload to IPFS failed', error: error.message });
  }

 // Interact with blockchain
  let blockchainHash;
  let landId;
  let landHash;

  try {
    const txApprove = await contract.approveRegistrationRequest(requestId);
    const receiptApprove = await txApprove.wait();

    const event = receiptApprove.logs
      .map((log) => contract.interface.parseLog(log))
      .find((e) => e?.name === 'LandRegistered');

    landId = event?.args.landId.toString();

    const txVerify = await contract.verifyLand(landId);
    const receiptVerify = await txVerify.wait();
    blockchainHash = receiptVerify.hash;

    // Fetch landHash from contract
    const landData = await contract.getLand(landId);
    landHash = landData.landHash;
  } catch (error) {
    return res.status(500).json({ message: 'Blockchain approval failed', error: error.message });
  }

  // Save to MongoDB
  land.landId = landId;
  land.ipfsLandMeta = ipfsMetaCid;
  land.landHash = landHash; 
  land.status = 'verified';
  land.verifiedAt = new Date();
  land.tempDocuments = [];

  await land.save();

  res.status(200).json({
    message: 'Land approved and verified',
    land,
  });
});
