import express from "express";
import { VerifyToken, authorizeRoles } from "../middleware/auth.js";
import { getDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", VerifyToken, authorizeRoles("admin", "manager", "viewer"), getDashboard);

export default router;