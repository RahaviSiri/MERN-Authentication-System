import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req,res) => {
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.json({success: false,message: "Missing details"});
    }

    try{
        // Chcek whether user already exist ot not using email (email is unique)
        const existingUser = await userModel.findOne({email});
        // findOne() database query
        if(existingUser){
            return res.json({success: false,message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new userModel({name,email,password:hashedPassword}); 
        // Create new user in database.

        await user.save(); 
        // Save user in database.

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn: '7d'});
        res.cookie('token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
            // Stored in milli seconds
        });

        // The purpose of the cookie in this context is to store the token (JWT) securely on the client side and allow it to be sent back to the server with every request automatically

        // It allows the client (browser) to automatically include the token in subsequent requests to the server.
        // It ensures the token is securely stored, using features like httpOnly, secure, and sameSite.

        // Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email, 
            subject: "Welcome to Origin Website",
            text: `Welcome to Origin Website. Your account has been created using email ${email}`, 
        }

        await transporter.sendMail(mailOptions);

        return res.json({success:true});

    } catch(error){
        return res.json({success: false,message: error.message});
    }
}

// Proof of Authentication
// * The token acts as proof that the user has been authenticated (verified) by the server.
// * When a user logs in with their email and password, the server generates a token that contains user-related information (e.g., id: user._id).
// * The user stores this token, and for every subsequent request, the server uses this token to verify the user.
// * The user needs to store the token after logging in, and then it will be sent back to the server with each subsequent request to verify the user's identity. Here's how it works:

export const login = async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.json({success: false,message: "Email and Password are required"});
    }

    try{
        // Find user using email given by user
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false,message: "User doesn't exists"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success: false,message: "Password is wrong"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn: '7d'});
        res.cookie('token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        });
        
        return res.json({success:true});

    } catch(error){
        return res.json({success: false,message: error.message});
    }
}

export const logOut = async (req,res) => {
    try{
        
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        });
        
        return res.json({success:true,message:"Logged Out"});

    } catch(error){
        return res.json({success: false,message: error.message});
    }
}

export const sendVerifyOTP = async (req,res) => {
    try {
        const { userID } = req.body;
        const user = await userModel.findOne({ _id: userID });

        if(user.isAccountVerified){
            return res.json({success:false,message:"Already exists"});
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOTP = otp;
        user.verifyOTPExpireAt = Date.now() + 24*3600*1000;

        await user.save();

        // Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email, 
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}`, 
        }

        await transporter.sendMail(mailOptions);

        return res.json({success:true, message:"Verify OTP send on your email"});

    } catch (error) {
        res.json({success:false,message:error.message});
    }
}

export const verifyEmail = async (req,res) => {
    try {
        // otp can be taken from UI body but for userID we need middle ware.
        const { userID, otp } = req.body;
        
        if(!userID || !otp){
            return res.json({success:false, message:"Misssing Details"});
        }

        try {
            const user = await userModel.findOne({ _id: userID });
            if(!user){
                return res.json({success:false, message:"User not found"});
            }
            if(user.verifyOTP === '' || user.verifyOTP !== otp){
                return res.json({success:false, message:"OTP is wrong"});
            }
            if(user.verifyOTPExpireAt < Date.now()){
                return res.json({success:false, message:"OTP is expired"});
            }
            user.isAccountVerified = true;
            user.verifyOTP = "";
            user.verifyOTPExpireAt = 0;

            await user.save();
            
            return res.json({success:true, message:"Email is Verified Successfully"});

        } catch (error) {
            return res.json({success:false, message:error.message});
        }

    } catch (error) {
        res.json({ success:false, message:error.message});
    }
}