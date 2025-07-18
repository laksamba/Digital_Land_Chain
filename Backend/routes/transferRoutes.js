import express from "express";
import { initiateLandTransfer } from "../controllers/LandTransferController/InitiateLandTransfer.js";
import { approveTransfer } from "../controllers/LandTransferController/ApproveTransfer.js";
import { finalizeTransfer } from "../controllers/LandTransferController/finalizeTransfer.js";
import { verifyCertificate } from "../controllers/LandTransferController/verifyCertificateHash.js";
import { getLandDetails } from "../controllers/LandTransferController/viewLandDetails.js";
import { authMiddleware, restrictTo } from "../middleware/MiddleWare.js";

const router = express.Router();

router.post(
  "/initiate",
  authMiddleware,
  restrictTo("citizen"),
  initiateLandTransfer
);
router.post(
  "/approve/:landId",
  authMiddleware,
  restrictTo("land_officer"),
  approveTransfer
);
router.post(
  "/finalize/:landId",
  authMiddleware,
  restrictTo("citizen"),
  finalizeTransfer
);
router.post(
  "/verifyhash",
  authMiddleware,
  restrictTo("citizen", "land_officer"),
  verifyCertificate
);
router.get(
  "/view/:landId",
  authMiddleware,
  restrictTo("citizen", "land_officer"),
  getLandDetails
);

export default router;
