"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const config_1 = require("../../config/config");
const db_1 = require("../../config/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// get all user role:admin
const getAllUsers = async () => {
    const userResult = db_1.pool.query(`SELECT * FROM users`);
    return userResult;
};
const updateUsersById = async (payload, id) => {
    const { name, email, phone, role } = payload;
    const { rows } = await db_1.pool.query(`UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`, [name, email, phone, role, id]);
    return rows;
};
const deleteAUserByAdmin = async (userId, isAdmin) => {
    const token = isAdmin?.split(" ")[1];
    const decode = jsonwebtoken_1.default.verify(token, config_1.config.secret_key);
    const { role } = decode;
    console.log(role);
    if (role === "admin") {
        const isActiveuser = await db_1.pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [userId]);
        console.log(isActiveuser.rows[0].status);
        if (isActiveuser.rows[0].status !== "active") {
            const deleteuser = await db_1.pool.query(`DELETE FROM users WHERE id=$1`, [userId]);
            return deleteuser;
        }
        else {
            throw new Error("somethisn went wrong");
        }
    }
};
exports.userService = {
    getAllUsers,
    updateUsersById,
    deleteAUserByAdmin
};
