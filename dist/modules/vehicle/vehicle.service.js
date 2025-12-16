"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleService = void 0;
const config_1 = require("../../config/config");
const db_1 = require("../../config/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// vehicle created only on role admin
const VehicleCreate = async (payload) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const { rows } = await db_1.pool.query(`INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);
    return rows;
};
// getvehicle all vehicle
const getAllVehicle = async () => {
    const { rows } = await db_1.pool.query(`SELECT * FROM vehicles`);
    return rows;
};
//  getAllVehicleById role:public
const getVehicleById = async (id) => {
    const { rows } = await db_1.pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
    return rows;
};
const updateVehicleById = async (payload, id) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const { rows } = await db_1.pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]);
    return rows;
};
const deleteAVehicleByAdmin = async (vehicleId, isAdmin) => {
    const token = isAdmin?.split(" ")[1];
    const decode = jsonwebtoken_1.default.verify(token, config_1.config.secret_key);
    const { role } = decode;
    if (role.includes("admin")) {
        const isActiveBooking = await db_1.pool.query(`SELECT * FROM bookings WHERE vehicle_id=$1`, [vehicleId]);
        if (isActiveBooking.rows[0].status !== "active") {
            const deleteVehicle = await db_1.pool.query(`DELETE FROM vehicles WHERE id=$1`, [vehicleId]);
            return deleteVehicle;
        }
    }
};
exports.vehicleService = {
    VehicleCreate,
    getAllVehicle,
    getVehicleById,
    updateVehicleById,
    deleteAVehicleByAdmin
};
