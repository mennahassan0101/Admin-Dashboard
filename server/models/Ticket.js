import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Ticket = sequelize.define("Ticket", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  eventId: {                        // ← THIS is what was missing
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Events",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  type: {
    type: DataTypes.ENUM("VIP", "General"),
    allowNull: false,
  },
  ticketPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  sold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
},
{
  timestamps: true,
});

export default Ticket;