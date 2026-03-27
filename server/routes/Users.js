import express from "express";
import { login } from "../controllers/authController.js";
import { getUsersController,createUser ,updateUser,deleteUser } from "../controllers/userController.js";
import { authorizeRoles, VerifyToken } from "../middleware/auth.js";


const router =express.Router();
//no need for middleware
router.post("/login",login);// why post not get ? explain more

//Before getting to the controller - apply middleware
router.get("/",VerifyToken,authorizeRoles("admin"),getUsersController);
router.post("/add-user",VerifyToken,authorizeRoles("admin"),createUser);
router.put("/:id",VerifyToken,authorizeRoles("admin"),updateUser);
router.delete("/:id",VerifyToken,authorizeRoles("admin"),deleteUser);
export default router;