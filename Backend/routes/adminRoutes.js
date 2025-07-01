import express from 'express';
import { assignUserRoleWithBlockchain } from '../controllers/AdminController/assignUserRole.js';
import { getDashboardMetrics } from '../controllers/AdminController/dashBoardMetric.js';
import { getQuickStats } from '../controllers/AdminController/QuickStates.js';
import { getSystemHealth } from '../controllers/AdminController/systemHealth.js';
import { getRecentActivity } from '../controllers/AdminController/recentActivity.js';
import {  getUserById, updateUser, deleteUser } from '../controllers/AdminController/userManagemet.js';


const router = express.Router();

// Assign Land Officer Role (blockchain)
router.post("/userRole/:userId", assignUserRoleWithBlockchain);

// Admin Dashboard  routes
router.get("/dashboardMetrics", getDashboardMetrics);
router.get("/quickStats",getQuickStats);
router.get("/systemHealth", getSystemHealth);
router.get("/recentActivity",getRecentActivity);


// admin usermanagemet  routes
router.get("/users/:userId", getUserById);
router.put("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);


export default router;