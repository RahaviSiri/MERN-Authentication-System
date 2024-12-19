import express from 'express';
import { register,logOut,login, sendVerifyOTP, verifyEmail } from "../controller/authController.js";
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post("/register",register);
authRouter.post("/logout",logOut);
authRouter.post("/login",login);
authRouter.post("/sendVerifyOTP",userAuth,sendVerifyOTP);
authRouter.post("/verifyAccount",userAuth,verifyEmail);

export default authRouter;