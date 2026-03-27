import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const EventManager = sequelize.define("EventManager", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  managerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Events",
      key: "id",
    },
  },
},
{
  timestamps: true,
});

export default EventManager;