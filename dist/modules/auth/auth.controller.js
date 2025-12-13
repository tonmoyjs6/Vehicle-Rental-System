"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const signup = async (req, res) => {
    try {
        const result = await auth_service_1.authService.signup(req.body);
        console.log(result);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result?.rows[0]
        });
    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: error.message,
            data: null
        });
    }
};
const sigIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await auth_service_1.authService.signIn(email, password);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: error.message,
            data: null
        });
    }
};
exports.authController = {
    signup,
    sigIn
};
