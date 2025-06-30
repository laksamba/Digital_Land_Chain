import express from 'express';
import { assignLandOfficerRole } from '../controllers/AdminController/assignLandOfficerRole.js';


const router = express.Router();

router.post("/officerRole/:userId", assignLandOfficerRole);

export default router;