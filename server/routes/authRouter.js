import express from 'express';
import { register,logOut,login, sendVerifyOTP, verifyEmail, isAuthenticated, sendResetOTP, resetPassword } from "../controller/authController.js";
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post("/register",register);
authRouter.post("/logout",logOut);
authRouter.post("/login",login);
authRouter.post("/sendVerifyOTP",userAuth,sendVerifyOTP);
authRouter.post("/verifyAccount",userAuth,verifyEmail);
authRouter.get("/isAuth",userAuth,isAuthenticated);
authRouter.post("/sendResetOTP",sendResetOTP);
authRouter.post("/resetPassword",resetPassword);


export default authRouter;