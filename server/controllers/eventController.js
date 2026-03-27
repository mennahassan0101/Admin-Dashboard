import { Event, User, EventManager } from "../models/indexing.js";

// GET all events — filtered by role
export const getEvents = async (req, res) => {
  try {
    const { id, role } = req.user;
    let events;

    if (role === "admin") {
      // admin sees ALL events
      events = await Event.findAll({
        attributes: ["id", "name", "location", "date", "description",
          "attendees", "capacity", "status", "ticketPrice", "createdBy"]
      });
    } else {
      // manager sees only ASSIGNED events
      const user = await User.findByPk(id, {
        include: [{
          model: Event,
          as: "assignedEvents",
          attributes: ["id", "name", "location", "date", "description",
            "attendees", "capacity", "status", "ticketPrice", "createdBy"],
        }]
      });
      events = user.assignedEvents;
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

// POST assign manager to event — admin only
export const assignManager = async (req, res) => {
  try {
    const { id } = req.params;         // eventId
    const { managerId } = req.body;

    // check event exists
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // check user exists and is a manager
    const manager = await User.findByPk(managerId);
    if (!manager) {
      return res.status(404).json({ message: "User not found" });
    }
    if (manager.role !== "manager") {
      return res.status(400).json({ message: "User is not a manager" });
    }

    // check if already assigned
    const existing = await EventManager.findOne({
      where: { managerId, eventId: id }
    });
    if (existing) {
      return res.status(400).json({ message: "Manager already assigned to this event" });
    }

    await EventManager.create({ managerId, eventId: id });

    res.status(201).json({ message: "Manager assigned successfully" });

  } catch(error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE remove manager from event — admin only
export const removeManager = async (req, res) => {
  try {
    const { id, managerId } = req.params;

    const assignment = await EventManager.findOne({
      where: { managerId, eventId: id }
    });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    await assignment.destroy();
    res.status(200).json({ message: "Manager removed from event" });

  } catch(error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET all managers for an event — admin only
export const getEventManagers = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      include: [{
        model: User,
        as: "assignedManagers",
        attributes: ["id", "name", "email", "role"],
      }]
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event.assignedManagers);

  } catch(error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};