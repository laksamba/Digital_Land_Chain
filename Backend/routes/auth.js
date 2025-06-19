import express from 'express';
import { registerUser, submitKyc,verifyKyc, loginUser } from '../controllers/UserController.js';
import { authMiddleware, checkKyc , restrictTo,} from '../middleware/MiddleWare.js';


const router = express.Router();

// User Registration Route
router.post('/register', registerUser);


// KYC Submission Route
router.post('/kyc',authMiddleware, submitKyc);

// verify kyc
router.post('/kyc/verify',authMiddleware,restrictTo('land_officer'),verifyKyc );

// login Route
router.get('/login', authMiddleware, loginUser);

export default router;