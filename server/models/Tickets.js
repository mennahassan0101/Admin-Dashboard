import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import Event from "./Event.js";

const Ticket =sequelize.define("Ticket",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    TYPES : {
        type:DataTypes.ENUM("VIP","General"),
        allowNull:false,
    },
    TicketPrice:{
        type:DataTypes.DECIMAL(10,2),       
    }
    ,
    eventID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Event,
            key:"id",
        },
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0,
    },
    sold:{
        type:DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0,
    }
},
    {
     timestamps: true,        // adds createdAt and updatedAt columns automatically
    }
);

export default Ticket;
