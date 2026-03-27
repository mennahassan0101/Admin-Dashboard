import { Event, User } from "../models/indexing.js";
import sequelize from "../config/db.js";

// GET dashboard stats — admin only
export const getDashboardStats = async (req, res) => {
    try {
        const totalEvents = await Event.count();
        const totalUsers  = await User.count();

        const events = await Event.findAll({
            attributes: ["attendees", "ticketPrice"]
        });

        const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);
        const totalRevenue   = events.reduce((sum, e) =>
            sum + (e.attendees * parseFloat(e.ticketPrice)), 0
        );
        const totalCapacity  = events.reduce((sum, e) => sum + e.capacity, 0);
        const fillRate = totalCapacity > 0
            ? ((totalAttendees / totalCapacity) * 100).toFixed(1) + "%"
            : "0%";

        const eventsByStatus = await Event.findAll({
            attributes: [
                "status",
                [sequelize.fn("COUNT", sequelize.col("id")), "count"]
            ],
            group: ["status"]
        });

        res.status(200).json({
            totalEvents,
            totalUsers,
            totalAttendees,
            totalRevenue: totalRevenue.toFixed(2),
            fillRate,
            eventsByStatus,
        });

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET engagement metrics — admin + manager
export const getEngagementMetrics = async (req, res) => {
    try {
        const { id, role } = req.user;
        let events;

        if (role === "admin") {
            events = await Event.findAll({
                attributes: ["id", "name", "attendees", "capacity", "status"]
            });
        } else {
            // manager sees only assigned events
            const user = await User.findByPk(id, {
                include: [{
                    model: Event,
                    as: "assignedEvents",
                    attributes: ["id", "name", "attendees", "capacity", "status"],
                }]
            });
            events = user.assignedEvents;
        }

        const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);
        const totalCapacity  = events.reduce((sum, e) => sum + e.capacity, 0);
        const totalEvents    = events.length;
        const fillRate = totalCapacity > 0
            ? ((totalAttendees / totalCapacity) * 100).toFixed(1) + "%"
            : "0%";

        const metrics = events.map(event => ({
            id: event.id,
            name: event.name,
            attendees: event.attendees,
            capacity: event.capacity,
            fillRate: event.capacity > 0
                ? ((event.attendees / event.capacity) * 100).toFixed(1) + "%"
                : "0%",
            status: event.status,
        }));

        res.status(200).json({
            totalEvents,
            totalAttendees,
            totalCapacity,
            fillRate,
            events: metrics,
        });

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET attendance stats — admin + manager
export const getAttendanceStats = async (req, res) => {
    try {
        const { id, role } = req.user;
        let events;

        if (role === "admin") {
            events = await Event.findAll({
                attributes: ["id", "name", "attendees", "capacity", "date", "status"]
            });
        } else {
            const user = await User.findByPk(id, {
                include: [{
                    model: Event,
                    as: "assignedEvents",
                    attributes: ["id", "name", "attendees", "capacity", "date", "status"],
                }]
            });
            events = user.assignedEvents;
        }

        const totalAttendees  = events.reduce((sum, e) => sum + e.attendees, 0);
        const totalCapacity   = events.reduce((sum, e) => sum + e.capacity, 0);
        const overallFillRate = totalCapacity > 0
            ? ((totalAttendees / totalCapacity) * 100).toFixed(1) + "%"
            : "0%";

        const stats = events.map(event => ({
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
            overallFillRate,
            totalAttendees,
            totalCapacity,
            events: stats,
        });

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};