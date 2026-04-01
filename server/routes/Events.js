import express from "express";
import { authorizeRoles, VerifyToken } from "../middleware/auth.js";
import {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    assignManager,
    removeManager,
    getEventManagers,
} from "../controllers/eventController.js";

const router = express.Router();

// admin + manager + viewer — view only, filtered by role inside controller
router.get("/", VerifyToken, authorizeRoles("admin", "manager", "viewer"), getEvents);
router.get("/:id", VerifyToken, authorizeRoles("admin", "manager", "viewer"), getEventById);

// admin ONLY — all modifications
router.post("/create-event", VerifyToken, authorizeRoles("admin"), createEvent);
router.put("/update/:id", VerifyToken, authorizeRoles("admin"), updateEvent);
router.delete("/delete/:id", VerifyToken, authorizeRoles("admin"), deleteEvent);

// Admin only — manage assignments
router.post("/update/:id/assign", VerifyToken, authorizeRoles("admin"), assignManager);
router.delete("/:id/assign/:managerId", VerifyToken, authorizeRoles("admin"), removeManager);
router.get("/:id/managers", VerifyToken, authorizeRoles("admin"), getEventManagers);

export default router;