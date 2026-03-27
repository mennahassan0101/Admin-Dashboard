import express from "express";
import { VerifyToken, authorizeRoles } from "../middleware/auth.js";
import {
    getDashboardStats,
    getEngagementMetrics,
    getAttendanceStats,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/stats", VerifyToken, authorizeRoles("admin"), getDashboardStats);
router.get("/engagement", VerifyToken, authorizeRoles("admin", "manager"), getEngagementMetrics);
router.get("/attendance", VerifyToken, authorizeRoles("admin", "manager"), getAttendanceStats);

export default router;