"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("./user.service");
// get all user role:admin
const getAllUsers = async (req, res) => {
    try {
        const result = await user_service_1.userService.getAllUsers();
        const { rows } = result;
        // console.log(result);
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: rows
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
const updateUsersById = async (req, res) => {
    const id = req.params.userId;
    // console.log(req.body);
    try {
        const result = await user_service_1.userService.updateUsersById(req.body, id);
        // console.log(result);
        res.status(200).json({
            success: true,
            message: "Users Updated successfully",
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
const deleteAUserByAdmin = async (req, res) => {
    try {
        const result = await user_service_1.userService.deleteAUserByAdmin(req.params.userId, req.headers.authorization);
        console.log(result);
        res.status(200).json({
            success: true,
            message: "User Deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            succes: false,
            message: error.message
        });
    }
};
exports.userController = {
    getAllUsers,
    updateUsersById,
    deleteAUserByAdmin
};
