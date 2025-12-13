"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const db_1 = require("../../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config/config");
const signup = async (payload) => {
    const { name, email, password, phone, role } = payload;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await db_1.pool.query(`INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5)RETURNING *`, [name, email, hashedPassword, phone, role]);
    if (user.rows[0].length === 0) {
        return;
    }
    return user;
};
const signIn = async (email, password) => {
    const user = await db_1.pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    const match = await bcrypt_1.default.compare(password, user.rows[0].password);
    if (user.rows[0].length == 0) {
        return null;
    }
    if (!match) {
        return false;
    }
    const jwtPayload = {
        name: user.rows[0].name,
        email: user.rows[0].email,
        phone: user.rows[0].phone,
        role: user.rows[0].role
    };
    const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.config.secret_key);
    if (!token) {
        return false;
    }
    return { token, user };
};
exports.authService = {
    signup,
    signIn
};
