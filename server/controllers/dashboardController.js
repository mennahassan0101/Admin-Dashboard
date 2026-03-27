import { Event, User } from "../models/indexing.js";
import sequelize from "../config/db.js";
export const getDashboard = async (req, res) => {
  try {
    const { id, role } = req.user;
    let events;

    if (role === "admin") {
      events = await Event.findAll();
    } else {
      const user = await User.findByPk(id, {
        include: [{ model: Event, as: "assignedEvents" }]
      });
      events = user.assignedEvents;
    }

    const totalEvents    = events.length;
    const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);
    const totalCapacity  = events.reduce((sum, e) => sum + e.capacity, 0);
    const totalRevenue   = events.reduce((sum, e) =>
      sum + (e.attendees * parseFloat(e.ticketPrice)), 0
    );
    const avgFillRate = totalCapacity > 0
      ? ((totalAttendees / totalCapacity) * 100).toFixed(1) + "%"
      : "0%";

    const statusBreakdown = ["upcoming", "live", "selling", "closed"].map(status => ({
      status,
      count: events.filter(e => e.status === status).length,
    })).filter(s => s.count > 0);

    const recentEvents = [...events]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
        .map(e => ({
            id: e.id,
            name: e.name,
            date: e.date,
            location: e.location,
            status: e.status,
            attendees: e.attendees,
            capacity: e.capacity,
            fillRate: e.capacity > 0
            ? ((e.attendees / e.capacity) * 100).toFixed(1) + "%"
            : "0%",
            revenue: (e.attendees * parseFloat(e.ticketPrice)).toFixed(2),
    }));

    // Monthly revenue for admin — last 6 months
    let monthlyRevenue = [];
    if (role === "admin") {
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        months.push({
          label: d.toLocaleString("default", { month: "short" }).toUpperCase(),
          year:  d.getFullYear(),
          month: d.getMonth(),
        });
      }

      monthlyRevenue = months.map(m => {
        const monthEvents = events.filter(e => {
          const d = new Date(e.date);
          return d.getMonth() === m.month && d.getFullYear() === m.year;
        });
        const revenue = monthEvents.reduce((sum, e) =>
          sum + (e.attendees * parseFloat(e.ticketPrice)), 0
        );
        return { month: m.label, revenue };
      });
    }

    res.status(200).json({
      totalEvents,
      totalAttendees,
      avgFillRate,
      totalRevenue: role === "admin" ? totalRevenue.toFixed(2) : undefined,
      statusBreakdown,
      recentEvents,
      monthlyRevenue,
    });

  } catch(error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};