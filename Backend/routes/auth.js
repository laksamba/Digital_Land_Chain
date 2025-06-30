import express from 'express';
import { registerUser, submitKyc,verifyKyc, loginUser } from '../controllers/UsersController/UserController.js';
import { authMiddleware, checkKyc , restrictTo,} from '../middleware/MiddleWare.js';
import { registerValidator } from '../middleware/registerValidator.js';
import upload from '../middleware/multer.js';
import { getUserDetails } from '../controllers/UsersController/getUserDetaits.js';


const router = express.Router();

// User Registration Route
router.post('/register',registerValidator, registerUser);


// KYC Submission Route
router.post('/kyc',authMiddleware,upload.fields([
    {name:'photo', maxCount: 1},
    {name:'documents', maxCount: 5}
]) , submitKyc);

// verify kyc
router.post('/kyc/verify',authMiddleware,restrictTo('land_officer'),verifyKyc );

// login Route
router.post('/login', loginUser);

router.get('/user', authMiddleware, getUserDetails);

export default router;