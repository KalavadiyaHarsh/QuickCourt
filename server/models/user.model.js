import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide name"]
    },
    email: {
        type: String,
        required: [true, "Provide Email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Provide Password"]
    },
    avatar: {
        type: String,
        default: ""
    },
    mobile: {
        type: String,
        default: null
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    access_token: {
        type: String,
        default: ''
    },
    refresh_token: {
        type: String,
        default: ''
    },
    last_login_date: {
        type: Date,
        default: null   // ❌ Use null instead of "" for Date type
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    otp: {
        type: String

    },
    otpExpires: {
        type: Date

    },
    role: {
        type: String,
        enum: ['ADMIN', "USER"],
        default: "USER"
    }
},
    { timestamps: true });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
