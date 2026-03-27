import express from "express";
import { VerifyToken, authorizeRoles } from "../middleware/auth.js";
import { getTotalRevenue, getRevenueByEvent } from "../controllers/revenueController.js";

const router = express.Router();

router.get("/", VerifyToken, authorizeRoles("admin"), getTotalRevenue);
router.get("/:id", VerifyToken, authorizeRoles("admin"), getRevenueByEvent);

export default router;