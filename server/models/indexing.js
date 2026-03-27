import User from "./User.js";
import Event from "./Event.js";
import Ticket from "./Ticket.js";
import EventManager from "./EventManager.js";
// User creates Events
User.hasMany(Event, { foreignKey: "createdBy", as: "createdEvents" });
Event.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// Event has many Tickets
Event.hasMany(Ticket, { foreignKey: "eventId", as: "tickets" });
Ticket.belongsTo(Event, { foreignKey: "eventId", as: "event" });

// Manager assigned to many Events
User.belongsToMany(Event, {
  through: EventManager,
  foreignKey: "managerId",
  as: "assignedEvents",
});
Event.belongsToMany(User, {
  through: EventManager,
  foreignKey: "eventId",
  as: "assignedManagers",
});

export { User, Event, Ticket, EventManager };
