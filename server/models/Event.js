import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Event = sequelize.define("Event", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,       // description can be optional
    },
    attendees: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("upcoming", "live", "selling", "closed"),
        allowNull: false,
        defaultValue: "upcoming",
    },
    ticketPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
    },
},
{
    timestamps: true,
});

export default Event;
