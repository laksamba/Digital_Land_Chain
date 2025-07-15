import express from "express";
import { approveLandRegistration } from "../controllers/LandController/approveLandRegistration.js";
import { submitLandRegistration } from "../controllers/LandController/submitLandRegistration.js";
import { authMiddleware, restrictTo } from "../middleware/MiddleWare.js";
import upload from "../middleware/multer.js";
import { getLandWithOwnerDetails } from "../controllers/LandController/GetlandDetails.js";
import { rejectLandRegistration } from "../controllers/LandController/RejectLandRegistration.js";
import { getAllLandsWithOwners } from "../controllers/LandController/getAllLandsWithOwners.js";

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

router.put(
  "/land/reject/:id",
  authMiddleware,
  restrictTo("land_officer"),
  rejectLandRegistration
);


router.get(
  "/land/:id",
  authMiddleware,
  restrictTo("citizen", "land_officer"),
  getLandWithOwnerDetails
);

// fetch all lands 
router.get("/land/:id", getLandWithOwnerDetails);
router.get(
  "/land",
  authMiddleware,
  restrictTo("land_officer", "admin"),
  getAllLandsWithOwners
)
  

export default router;
