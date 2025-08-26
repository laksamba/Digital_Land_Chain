import asyncHandler from "express-async-handler";
import Land from "../../models/Land.js";
import { contract, contractWithSigner, pinata } from "../../utils/Blockchain.js";

export const approveLandRegistration = asyncHandler(async (req, res) => {
  console.log("✅ Controller HIT");
  console.log("Request body:", req.body);
  const { id } = req.params;
  const { status, requestId } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  if (!requestId || isNaN(requestId)) {
    return res.status(400).json({ message: "Invalid requestId" });
  }

  const land = await Land.findById(id).populate("owner");
  if (!land) {
    return res.status(404).json({ message: "Land not found" });
  }
  console.log("Land found:", land);

  if (land.status !== "pending") {
    return res.status(400).json({ message: "Land already processed" });
  }

  if (status === "rejected") {
    land.tempDocuments = [];
    land.status = "rejected";
    await land.save();
    return res.status(200).json({ message: "Land registration rejected" });
  }

  // Check blockchain state first
  let landId, landHash, ipfsMetaCid;
  try {
    // Check if the registration request is already approved
    const requestData = await contract.registrationRequests(requestId);
    if (requestData.requester !== "0x0000000000000000000000000000000000000000" && requestData.approved) {
      console.log("Registration request already approved on blockchain:", requestData);

      // Query LandRegistered events, filtering by owner (indexed)
      let fromBlock = 0;
      let latestBlock = Number.MAX_SAFE_INTEGER;
      try {
        latestBlock = await contract.provider.getBlockNumber();
        fromBlock = Math.max(latestBlock - 10000, 0); // Limit to last 10,000 blocks
      } catch (error) {
        console.error("Failed to get block number, using fallback range:", error.message);
      }

      const filter = contract.filters.LandRegistered(null, requestData.requester, null);
      const events = await contract.queryFilter(filter, fromBlock, latestBlock);
      const matchingEvent = events.find(
        (e) => e.args.landHash === requestData.landHash
      );

      if (matchingEvent) {
        landId = matchingEvent.args.landId.toString();
        const landData = await contract.getLand(landId);
        landHash = landData.landHash;

        // Check if metadata is already pinned to IPFS
        if (!land.ipfsLandMeta) {
          const metadata = {
            owner: {
              userId: land.owner._id.toString(),
              ethAddress: land.owner.ethAddress,
            },
            location: land.location,
            area: land.area,
            documentCIDs: land.ipfsDocuments,
          };

          const result = await pinata.pinJSONToIPFS(metadata, {
            pinataMetadata: {
              name: `land-meta-${land._id.toString()}`,
            },
          });
          ipfsMetaCid = result.IpfsHash;
        } else {
          ipfsMetaCid = land.ipfsLandMeta;
        }

        // Update database to sync with blockchain
        const session = await Land.startSession();
        try {
          session.startTransaction();
          land.landId = landId;
          land.ipfsLandMeta = ipfsMetaCid;
          land.landHash = landHash;
          land.status = "verified";
          land.verifiedAt = new Date();
          land.tempDocuments = [];
          await land.save({ session });
          await session.commitTransaction();
        } catch (error) {
          await session.abortTransaction();
          throw error;
        } finally {
          session.endSession();
        }

        return res.status(200).json({
          message: "Land already approved on blockchain, database synced",
          land,
        });
      } else {
        return res.status(500).json({
          message: "Failed to sync with blockchain: Land ID not found",
        });
      }
    }
  } catch (error) {
    console.error("Error checking blockchain state:", error);
    // Continue to attempt approval if the request check fails
  }

  // Prepare metadata for IPFS
  try {
    const metadata = {
      owner: {
        userId: land.owner._id.toString(),
        ethAddress: land.owner.ethAddress,
      },
      location: land.location,
      area: land.area,
      documentCIDs: land.ipfsDocuments,
    };

    const result = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: {
        name: `land-meta-${land._id.toString()}`,
      },
    });
    ipfsMetaCid = result.IpfsHash;
    console.log('✅ IPFS metadata pinned:', ipfsMetaCid);
  } catch (error) {
    return res.status(500).json({
      message: "Metadata upload to IPFS failed",
      error: error.message,
    });
  }

  // Interact with blockchain
  let blockchainHash;
  try {
    const txApprove = await contractWithSigner.approveRegistrationRequest(requestId);
    const receiptApprove = await txApprove.wait();

    const event = receiptApprove.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch (error) {
          return null;
        }
      })
      .find((e) => e?.name === "LandRegistered");

    if (!event) {
      return res.status(500).json({ message: "LandRegistered event not found" });
    }

    landId = event.args.landId.toString();

    const txVerify = await contractWithSigner.verifyLand(landId);
    const receiptVerify = await txVerify.wait();
    blockchainHash = receiptVerify.transactionHash;

// Fetch fresh data from contract
const landData = await contract.getLand(landId);
landHash = landData.landHash;
console.log('✅ Land hash from contract:', landHash);

  } catch (error) {
    if (error.reason === "Already approved") {
      // Handle case where blockchain approval was already done
      try {
        const requestData = await contract.registrationRequests(requestId);
        if (requestData.approved) {
          let fromBlock = 0;
          let latestBlock = Number.MAX_SAFE_INTEGER;
          try {
            latestBlock = await contract.provider.getBlockNumber();
            fromBlock = Math.max(latestBlock - 10000, 0);
          } catch (error) {
            console.error("Failed to get block number, using fallback range:", error.message);
          }

          const filter = contract.filters.LandRegistered(null, requestData.requester, null);
          const events = await contract.queryFilter(filter, fromBlock, latestBlock);
          const matchingEvent = events.find(
            (e) => e.args.landHash === requestData.landHash
          );

          if (matchingEvent) {
            landId = matchingEvent.args.landId.toString();
            const landData = await contract.getLand(landId);
            landHash = landData.landHash;

            // Update database
            const session = await Land.startSession();
            try {
              session.startTransaction();
              land.landId = landId;
              land.ipfsLandMeta = ipfsMetaCid;
              land.landHash = landHash;
              land.status = "verified";
              land.verifiedAt = new Date();
              land.tempDocuments = [];
              await land.save({ session });
              await session.commitTransaction();
            } catch (error) {
              await session.abortTransaction();
              throw error;
            } finally {
              session.endSession();
            }

            return res.status(200).json({
              message: "Land already approved on blockchain, database synced",
              land,
            });
          }
        }
        return res.status(500).json({
          message: "Failed to sync with blockchain: Land ID not found",
        });
      } catch (syncError) {
        return res.status(500).json({
          message: "Blockchain sync failed",
          error: syncError.message,
        });
      }
    }
    return res.status(500).json({
      message: "Blockchain approval failed",
      error: error.message,
    });
  }

  // Save to MongoDB
  const session = await Land.startSession();
  try {
    session.startTransaction();
    land.landId = landId;
    land.ipfsLandMeta = ipfsMetaCid;
    land.landHash = landHash;
    land.status = "verified";
    land.verifiedAt = new Date();
    land.tempDocuments = [];
    await land.save({ session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  res.status(200).json({
    message: "Land approved and verified",
    land,
  });
});