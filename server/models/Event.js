import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
const Event =sequelize.define("Event",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,       
    },
    location:{
        type:DataTypes.STRING,
        allowNull:false,   
    },
    date:{
        type:DataTypes.DATE,
        allowNull:false, 
    },
    desciption:{
        type:DataTypes.STRING,
        allowNull:false,   
    },
    NumOfAttendees:{
        type:DataTypes.INTEGER,
        defaultValue:0,
        allowNull:false
    },
    status:{
        type:DataTypes.ENUM("upcoming","live" ,"selling" , "closed"),
        allowNull:false,
    },
    ticketPrice:{
        type:DataTypes.DOUBLE,
        allowNull:false,
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references :{
            model:User,
            key : "id",
        },

    },
}
);

export default Event;