import express from "express";
import { approveLandRegistration } from "../controllers/LandController/approveLandRegistration.js";
import { submitLandRegistration } from "../controllers/LandController/submitLandRegistration.js";
import { authMiddleware, restrictTo } from "../middleware/MiddleWare.js";
import upload from "../middleware/multer.js";
import { getLandWithOwnerDetails } from "../controllers/LandController/GetlandDetails.js";

const router = express.Router();

router.post(
  "/submit",
  authMiddleware,
  restrictTo("citizen"),
  upload.array("tempDocuments", 5),
  submitLandRegistration
);

router.put(
  "/land/approve/:id",
  authMiddleware,
  restrictTo("land_officer"),
  approveLandRegistration
);

router.get(
  "/land/:id",
  restrictTo("citizen", "land_officer"),
  getLandWithOwnerDetails
);

export default router;
