import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User= sequelize.define("User",
    {
        id :{
            type:DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey :true,
        },
        name :{
            type: DataTypes.STRING,
            allowNull:false,
        },
        email :{
            type:DataTypes.STRING,
            allowNull: false,
            unique:true,
            validate : {
                isEmail:true,
            },
        },
        password : {
            type:DataTypes.STRING,
            allowNull:false,
        },
        role : {
            type:DataTypes.ENUM("admin","manager","viewer"),
            defaultValue:"viewer",
        },
    },
    {
     timestamps: true,        // adds createdAt and updatedAt columns automatically
    }
);

export default User;