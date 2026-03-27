import { Event, User } from "../models/indexing.js";
import sequelize from "../config/db.js";

// GET /api/analytics/stats — admin only
export const getDashboardStats = async (req, res) => {
    try {
        const totalEvents = await Event.count();
        const totalUsers  = await User.count();

        const events = await Event.findAll({ raw: true });

        const totalAttendees = events.reduce((sum, e) => sum + (e.attendees || 0), 0);
        const totalRevenue   = events.reduce((sum, e) => sum + ((e.attendees || 0) * (e.ticketPrice || 0)), 0);
        const totalCapacity  = events.reduce((sum, e) => sum + (e.capacity || 0), 0);

        const eventsByStatus = await Event.findAll({
            attributes: [
                "status",
                [sequelize.fn("COUNT", sequelize.col("id")), "count"]
            ],
            group: ["status"],
            raw: true,
        });

        res.status(200).json({
            totalEvents,
            totalUsers,
            totalAttendees,
            totalCapacity,
            totalRevenue: parseFloat(totalRevenue.toFixed(2)),
            fillRate: totalCapacity > 0
                ? ((totalAttendees / totalCapacity) * 100).toFixed(1) + "%"
                : "0%",
            eventsByStatus,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET /api/analytics/engagement — admin + manager
export const getEngagementMetrics = async (req, res) => {
    try {
        const { id, role } = req.user;
        const where = role === "admin" ? {} : { createdBy: id };

        const events = await Event.findAll({
            where,
            attributes: ["id", "name", "attendees", "capacity", "status"],
            raw: true,
        });

        const metrics = events.map(e => ({
            id:       e.id,
            name:     e.name,
            attendees: e.attendees,
            capacity:  e.capacity,
            fillRate:  e.capacity > 0
                ? ((e.attendees / e.capacity) * 100).toFixed(1) + "%"
                : "0%",
            status:   e.status,
        }));

        res.status(200).json(metrics);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET /api/analytics/attendance — admin + manager
export const getAttendanceStats = async (req, res) => {
    try {
        const { id, role } = req.user;
        const where = role === "admin" ? {} : { createdBy: id };

        const events = await Event.findAll({
            where,
            attributes: ["id", "name", "attendees", "capacity", "date", "status"],
            raw: true,
        });

        const totalAttendees = events.reduce((sum, e) => sum + (e.attendees || 0), 0);
        const totalCapacity  = events.reduce((sum, e) => sum + (e.capacity  || 0), 0);

        res.status(200).json({
            totalAttendees,
            totalCapacity,
            overallFillRate: totalCapacity > 0
                ? ((totalAttendees / totalCapacity) * 100).toFixed(1) + "%"
                : "0%",
            events: events.map(e => ({
                id:        e.id,
                name:      e.name,
                date:      e.date,
                attendees: e.attendees,
                capacity:  e.capacity,
                fillRate:  e.capacity > 0
                    ? ((e.attendees / e.capacity) * 100).toFixed(1) + "%"
                    : "0%",
                status:    e.status,
            })),
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};