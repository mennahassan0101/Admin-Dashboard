import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req,res) => {
    try{
        const {email , password}=req.body;
        const user = await User.findOne({where : {email}});

        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
         return res.status(400).json({ message: "Invalid credentials" });
        }        

        //  generate JWT token
        const token = jwt.sign(
            {id : user.id, role : user.role},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES_IN}
        );

        res.status(200).json({
            message:"Login Successful",
            token,
            user :{
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
        
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};