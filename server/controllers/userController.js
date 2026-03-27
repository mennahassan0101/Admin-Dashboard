import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getUsersController=async (req,res)=>{
    try{
     const users=await User.findAll({
       attributes:["id","name","email", "role", "createdAt"]
     });
     if(users.length===0){
        return res.status(404).json({message:"No Users Found"});
     }
   
     return res.status(200).json(users);
     
    }
    catch(error){
        return res.status(500).json({ 
        message: "Internal Server Error", 
        error: error.message 
     });    
    }

};
export const createUser = async (req,res)=>{
    try{
        
        const {name,email,password,role} = req.body;
        if(!name||!email||!password||!role){
            return res.status(400).json({message:"All Fields are required"});
        }
        const existingUser = await User.findOne({where:{email}});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const salt= await bcrypt.genSalt(10);
        const HashedPassword = await bcrypt.hash(password,salt);

        const newUser= await User.create({name,email,password:HashedPassword,role});
        res.status(201).json({
            message:"User added Succesfully.",
            user:{
                id:newUser.id,
                name:newUser.name,
                email:newUser.email,
                role:newUser.role,
            }      
        });
    }
    catch(error){
        return res.status(500).json({message:"Server Error"});
    }
};
export const updateUser = async (req,res)=>{
    try{
        const {id} =req.params;
        const user= await User.findByPk(id);
        if(!user){
            return res.status(404).json({message:"User doesn't exist"});
        }
        const {name,email,role}=req.body;
        const updatedData={name,email,role};
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(req.body.password,salt);
        }

        await User.update(updatedData,{where:{id}});
        const updatedUser= await User.findByPk(id,
            {attributes:["id", "name", "email", "role"],}
        );
        
        res.status(200).json({message: "User updated Succesfully.",
            user:{
                id:id,
                name:updatedUser.name,
                email:updatedUser.email,
                role:updatedUser.role,
            }
        });    
    }
    catch(error){
        return res.status(500).json({message:"Server Error"});        
    }
};
export const deleteUser= async (req,res)=>{
    try{
        const {id}=req.params;
        const user= await User.findByPk(id);
        
        if(!user){
            return res.status(404).json({message:"User doesn't exist !"});
        }
        if (user.role === "admin") {
            return res.status(403).json({ message: "Cannot delete an admin account!" });
        }
        await User.destroy({where:{id}});
        res.status(200).json({message:"User deleted Succesfully."});
        
    }
    catch(error){
        return res.status(500).json({message:"Server Error!" , error:error.message});
    }   
};
   
