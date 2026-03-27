import { Event, User } from "../models/indexing.js";
import sequelize from "../config/db.js";

export const getDashboard = async (req, res) => {
    try {
        const { id, role } = req.user;

        let events;
        if (role === "admin") {
            events = await Event.findAll();
        } else if (role === "manager") {
            events = await Event.findAll({ where: { createdBy: id } });
        } else {
            events = await Event.findAll({
                attributes: ["id", "name", "location", "date", "status", "capacity", "attendees"]
            });
        }

        const totalEvents = events.length;
        const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);
        const totalRevenue = role !== "viewer"
            ? events.reduce((sum, e) => sum + (e.attendees * e.ticketPrice), 0)
            : null;
        const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);
        const fillRate = totalCapacity > 0
            ? ((totalAttendees / totalCapacity) * 100).toFixed(1) + "%"
            : "0%";

        const upcomingEvents = events
            .filter(e => e.status === "upcoming" || e.status === "selling")
            .slice(0, 5);

        res.status(200).json({
            totalEvents,
            totalAttendees,
            totalRevenue: role !== "viewer" ? totalRevenue.toFixed(2) : "N/A",
            fillRate,
            upcomingEvents,
        });

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};