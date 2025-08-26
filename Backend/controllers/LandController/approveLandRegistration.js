import asyncHandler from "express-async-handler";
import Land from "../../models/Land.js";
import { contract, pinata } from "../../utils/Blockchain.js";

export const approveLandRegistration = asyncHandler(async (req, res) => {
  console.log("✅ Controller HIT");
  console.log('Request params:', req.params);
  console.log('Request body:', req.body);

  const { id } = req.params;
  const { status, requestId } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    console.log("❌ Invalid status:", status);
    return res.status(400).json({ message: 'Invalid status' });
  }

  const land = await Land.findById(id).populate('owner');
  if (!land) {
    console.log("❌ Land not found for ID:", id);
    return res.status(404).json({ message: 'Land not found' });
  }

  console.log('Land fetched:', land);

  if (land.status !== 'pending') {
    console.log("❌ Land already processed. Current status:", land.status);
    return res.status(400).json({ message: 'Land already processed' });
  }

  land.status = status;

  if (status === 'rejected') {
    land.tempDocuments = [];
    await land.save();
    console.log("⛔ Land registration rejected");
    return res.status(200).json({ message: 'Land registration rejected' });
  }

  // Metadata upload to IPFS
  const metadata = {
    owner: {
      userId: land.owner._id.toString(),
      ethAddress: land.owner.ethAddress,
    },
    location: land.location,
    area: land.area,
    documentCIDs: land.ipfsDocuments,
  };
  console.log('Metadata prepared for IPFS:', metadata);

  let ipfsMetaCid;
  try {
    const result = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: { name: `land-meta-${land._id.toString()}` }
    });
    ipfsMetaCid = result.IpfsHash;
    console.log('✅ IPFS metadata pinned:', ipfsMetaCid);
  } catch (error) {
    console.error('❌ IPFS pinning failed:', error);
    return res.status(500).json({ message: 'Metadata upload to IPFS failed', error: error.message });
  }

  // Blockchain approval
  let blockchainHash, landId, landHash;
  try {
    // Go straight to approving on-chain
console.log('⛓ Calling contract.approveRegistrationRequest with requestId:', requestId);
const txApprove = await contract.approveRegistrationRequest(requestId);
const receiptApprove = await txApprove.wait();
console.log('✅ Approve transaction receipt:', receiptApprove);

const event = receiptApprove.logs
  .map(log => {
    try { return contract.interface.parseLog(log); } catch { return null; }
  })
  .find(e => e?.name === 'LandRegistered');

if (!event || !event.args?.landId) {
  console.error('❌ LandRegistered event not found in logs:', receiptApprove.logs);
  return res.status(500).json({ message: 'LandRegistered event not found in blockchain transaction' });
}

landId = event.args.landId.toString();
console.log('✅ Land ID from event:', landId);

// Verify land on-chain
const txVerify = await contract.verifyLand(landId);
const receiptVerify = await txVerify.wait();
blockchainHash = receiptVerify.hash;
console.log('✅ verifyLand transaction hash:', blockchainHash);

// Fetch fresh data from contract
const landData = await contract.getLand(landId);
landHash = landData.landHash;
console.log('✅ Land hash from contract:', landHash);

  } catch (error) {
    console.error('❌ Blockchain approval failed:', error);
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
  console.log('✅ Land saved in DB:', land);

  res.status(200).json({
    message: 'Land approved and verified',
    land,
  });
});
