import { Event } from "../models/indexing.js";

// GET all events — filtered by role
export const getEvents = async (req, res) => {
    try {
        const { id, role } = req.user;

        let events;

        if (role === "admin") {
            // admin sees ALL events with full data
            events = await Event.findAll({
                attributes: ["id", "name", "location", "date", "description",
                    "attendees", "capacity", "status", "ticketPrice", "createdBy"]
            });
        } else if (role === "manager") {
            // manager sees ONLY their own events with full data
            events = await Event.findAll({
                where: { createdBy: id },
                attributes: ["id", "name", "location", "date", "description",
                    "attendees", "capacity", "status", "ticketPrice", "createdBy"]
            });
        } else {
            // viewer sees ALL events but with basic info only — no financial data
            events = await Event.findAll({
                attributes: ["id", "name", "location", "date", "status", "capacity", "attendees"]
            });
        }

        if (events.length === 0) {
            return res.status(404).json({ message: "No events found!" });
        }

        res.status(200).json(events);

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET single event — filtered by role
export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId, role } = req.user;

        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // manager can only view their own events
        if (role === "manager" && event.createdBy !== userId) {
            return res.status(403).json({ message: "Access denied. This is not your event." });
        }

        // viewer sees basic info only
        if (role === "viewer") {
            return res.status(200).json({
                id: event.id,
                name: event.name,
                location: event.location,
                date: event.date,
                status: event.status,
                capacity: event.capacity,
                attendees: event.attendees,
            });
        }

        // admin and manager (their own event) see full data
        res.status(200).json(event);

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// POST create event — admin only
export const createEvent = async (req, res) => {
    try {
        const { name, location, date, description, capacity, status, ticketPrice } = req.body;

        if (!name || !location || !date || !capacity || !status || !ticketPrice) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const ev = await Event.findOne({ where: { name, date } });
        if (ev) {
            return res.status(400).json({ message: "Event already exists on this date!" });
        }

        const createdBy = req.user.id;

        const newEvent = await Event.create({
            name, location, date, description,
            capacity, status, ticketPrice, createdBy
        });

        res.status(201).json({
            message: "Event created Successfully.",
            event: newEvent,
        });

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// PUT update event — admin only
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const { name, location, date, description, capacity, status, ticketPrice } = req.body;

        await Event.update(
            { name, location, date, description, capacity, status, ticketPrice },
            { where: { id } }
        );

        const updatedEvent = await Event.findByPk(id);
        res.status(200).json({
            message: "Event updated Successfully.",
            event: updatedEvent,
        });

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// DELETE event — admin only
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await Event.destroy({ where: { id } });
        res.status(200).json({ message: "Event deleted Successfully." });

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};