"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authChecker = void 0;
const db_1 = require("../config/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const authChecker = (...roles) => {
    return async (req, res, next) => {
        const bearerToken = req.headers.authorization;
        const token = bearerToken?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                succes: false,
                message: "you are not allowed"
            });
        }
        const decode = jsonwebtoken_1.default.verify(token, config_1.config.secret_key);
        const user = await db_1.pool.query(`SELECT * FROM users WHERE email=$1`, [decode.email]);
        if (user.rows[0].length === 0) {
            return res.status(400).json({
                success: false,
                message: "invalid input"
            });
        }
        req.user = decode;
        if (roles.length && !roles.includes(decode?.role)) {
            return res.status(500).json({
                message: "you are not allowed",
                error: "unauthorized"
            });
        }
        next();
    };
};
exports.authChecker = authChecker;
