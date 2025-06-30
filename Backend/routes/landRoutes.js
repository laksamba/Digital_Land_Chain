
import express from "express";
import { approveLandRegistration } from "../controllers/LandController/approveLandRegistration.js";
import { submitLandRegistration } from "../controllers/LandController/submitLandRegistration.js";
import { authMiddleware } from "../middleware/MiddleWare.js";
import upload from "../middleware/multer.js";
import { getLandWithOwnerDetails } from "../controllers/LandController/GetlandDetails.js";

const router = express.Router();

router.post(
  "/submit",
  authMiddleware,
  upload.array("tempDocuments", 5),
  submitLandRegistration
);

router.put(
  "/land/approve/:id",
  authMiddleware,
  approveLandRegistration
);

router.get('/land/:id', getLandWithOwnerDetails);

export default router;
