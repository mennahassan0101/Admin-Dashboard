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
            // manager sees only assigned events
            const user = await User.findByPk(id, {
                include: [{
                    model: Event,
                    as: "assignedEvents",
                    attributes: ["id", "name", "attendees", "capacity", "date", "status"],
                }]
            });
            events = user.assignedEvents;
        }

        const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);
        const totalCapacity  = events.reduce((sum, e) => sum + e.capacity, 0);
        const overallFillRate = totalCapacity > 0
            ? ((totalAttendees / totalCapacity) * 100).toFixed(1) + "%"
            : "0%";

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

        res.status(200).json({
            totalAttendees,
            totalCapacity,
            overallFillRate,
            events: attendance,
        });

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

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

        // manager can only update assigned events
        if (role === "manager") {
            const user = await User.findByPk(userId, {
                include: [{
                    model: Event,
                    as: "assignedEvents",
                    where: { id },
                }]
            });
            if (!user || user.assignedEvents.length === 0) {
                return res.status(403).json({ message: "Access denied. Not your event." });
            }
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