import express from "express";
import { authorizeRoles, VerifyToken } from "../middleware/auth.js";
import {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// admin + manager + viewer — view only, filtered by role inside controller
router.get("/", VerifyToken, authorizeRoles("admin", "manager", "viewer"), getEvents);
router.get("/:id", VerifyToken, authorizeRoles("admin", "manager", "viewer"), getEventById);

// admin ONLY — all modifications
router.post("/create-event", VerifyToken, authorizeRoles("admin"), createEvent);
router.put("/:id", VerifyToken, authorizeRoles("admin"), updateEvent);
router.delete("/:id", VerifyToken, authorizeRoles("admin"), deleteEvent);

export default router;