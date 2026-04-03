import jwt from "jsonwebtoken";

export const VerifyToken= (req,res,next) =>{ //Authentication
    
    const token=req.headers.authorization?.split(" ")[1];
    if(!token){
       return res.status(401).json({message:"Access Denied , No token provided"});
    }
    try{
        const decoded=jwt.verify(token ,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(error){
       return res.status(401).json({message:"Invalid or expired token."});
    }
};

export const authorizeRoles= (...roles) => {
    return (req,res,next)=>{ //Authorize middleware
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message:`Access denied. Required role: ${roles.join(" or ")}`
            });
        }
        next();
    }
};
