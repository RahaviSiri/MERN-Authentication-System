import mongoose from "mongoose";

//The schema defines the structure of the documents stored in the MongoDB user collection.

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOTP: {type: String, default: ''},
    verifyOTPExpireAt: {type: Number, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetOTP: {type: String, default: ''},
    resetOTPExpireAt: {type: Number, default: 0},
})

const userModel = mongoose.models.user || mongoose.model('user',userSchema);
// Name of model is "user" here
// Mongoose will create or use a collection named users in your MongoDB database.
// When you define a model name (like 'user' in this case), Mongoose automatically pluralizes it to create the MongoDB collection name.

// The mongoose.models.user || part ensures that the model is not redefined if it already exists.

export default userModel;