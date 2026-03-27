import { Event } from "../models/indexing.js";

// GET attendance for all events
export const getAttendance = async (req, res) => {
    try {
        const { id, role } = req.user;

        let events;
        if (role === "admin") {
            events = await Event.findAll({
                attributes: ["id", "name", "attendees", "capacity", "date", "status"]
            });
        } else {
            events = await Event.findAll({
                where: { createdBy: id },
                attributes: ["id", "name", "attendees", "capacity", "date", "status"]
            });
        }

        const attendance = events.map(event => ({
            id: event.id,
            name: event.name,
            date: event.date,
            attendees: event.attendees,
            capacity: event.capacity,
            fillRate: event.capacity > 0
                ? ((event.attendees / event.capacity) * 100).toFixed(1) + "%"
                : "0%",
            status: event.status,
        }));

        res.status(200).json(attendance);

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// PUT update attendance for an event — admin + manager
export const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { attendees } = req.body;
        const { id: userId, role } = req.user;

        if (attendees === undefined) {
            return res.status(400).json({ message: "Attendees count is required" });
        }

        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // manager can only update their own events
        if (role === "manager" && event.createdBy !== userId) {
            return res.status(403).json({ message: "Access denied. Not your event." });
        }

        if (attendees > event.capacity) {
            return res.status(400).json({ message: "Attendees cannot exceed capacity" });
        }

        await Event.update({ attendees }, { where: { id } });

        res.status(200).json({ message: "Attendance updated successfully", attendees });

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};