import { Event } from "../models/indexing.js";
import sequelize from "../config/db.js";

// GET total revenue — admin only
export const getTotalRevenue = async (req, res) => {
    try {
        const events = await Event.findAll({
            attributes: ["id", "name", "attendees", "ticketPrice", "status", "date"]
        });

        const revenueData = events.map(event => ({
            id: event.id,
            name: event.name,
            date: event.date,
            attendees: event.attendees,
            ticketPrice: event.ticketPrice,
            revenue: (event.attendees * event.ticketPrice).toFixed(2),
            status: event.status,
        }));

        const totalRevenue = revenueData.reduce(
            (sum, e) => sum + parseFloat(e.revenue), 0
        );

        res.status(200).json({
            totalRevenue: totalRevenue.toFixed(2),
            events: revenueData,
        });

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET revenue by event — admin only
export const getRevenueByEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByPk(id, {
            attributes: ["id", "name", "attendees", "ticketPrice", "capacity", "status"]
        });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const revenue = (event.attendees * event.ticketPrice).toFixed(2);
        const fillRate = event.capacity > 0
            ? ((event.attendees / event.capacity) * 100).toFixed(1) + "%"
            : "0%";

        res.status(200).json({
            id: event.id,
            name: event.name,
            attendees: event.attendees,
            capacity: event.capacity,
            ticketPrice: event.ticketPrice,
            revenue,
            fillRate,
            status: event.status,
        });

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};