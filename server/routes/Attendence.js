import express from "express";
import { VerifyToken, authorizeRoles } from "../middleware/auth.js";
import { getAttendance, updateAttendance } from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/", VerifyToken, authorizeRoles("admin", "manager"), getAttendance);
router.put("/:id", VerifyToken, authorizeRoles("admin", "manager"), updateAttendance);

export default router;