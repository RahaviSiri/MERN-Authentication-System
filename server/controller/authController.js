import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";

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

    } catch(error){
        return res.json({success: false,message: error.message});
    }
}

// Proof of Authentication
// * The token acts as proof that the user has been authenticated (verified) by the server.
// * When a user logs in with their email and password, the server generates a token that contains user-related information (e.g., id: user._id).
// * The user stores this token, and for every subsequent request, the server uses this token to verify the user.
// * The user needs to store the token after logging in, and then it will be sent back to the server with each subsequent request to verify the user's identity. Here's how it works:
