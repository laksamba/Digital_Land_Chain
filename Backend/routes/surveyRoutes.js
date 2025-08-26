import express from 'express';
import {
    createSurvey,
    getAllSurveys,
    getSurveyById,
    updateSurvey,
    deleteSurvey,
    getSurveyors,
} from '../controllers/SurveyController/surveyController.js';
import { authMiddleware, restrictTo } from '../middleware/MiddleWare.js';

const router = express.Router();

// Create a new survey request
router.post('/surveys', authMiddleware, createSurvey);

// Get all surveys (with optional filtering)
router.get('/surveys', authMiddleware, getAllSurveys);

// Get a single survey by ID
router.get('/surveys/:id', authMiddleware, getSurveyById);

// Update a survey (e.g., assign surveyOfficer, update status)
router.put('/surveys/:id', authMiddleware, restrictTo('admin', 'surveyor'), updateSurvey);

// Delete a survey
router.delete('/surveys/:id', authMiddleware, restrictTo('admin'), deleteSurvey);

// Get surveyors for assignment
router.get('/users', authMiddleware, getSurveyors);

export default router;