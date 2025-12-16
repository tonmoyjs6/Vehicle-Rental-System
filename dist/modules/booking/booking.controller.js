"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const booking_service_1 = require("./booking.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config/config");
const createBooking = async (req, res) => {
    // console.log(req.body);
    // no data found
    const { vehicle_id } = req.body;
    try {
        const vehiclesData = await booking_service_1.bookingService.vehiclesDetails(vehicle_id);
        const vehicleName = vehiclesData.rows[0].vehicle_name;
        const vehicleDailyPrice = vehiclesData.rows[0].daily_rent_price;
        const result = await booking_service_1.bookingService.createBooking(req.body);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
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
const getAllBooking = async (req, res) => {
    try {
        const bearerToken = req.headers.authorization;
        const token = bearerToken?.split(" ")[1];
        const decode = jsonwebtoken_1.default.verify(token, config_1.config.secret_key);
        const result = await booking_service_1.bookingService.getAllBooking(decode);
        res.status(201).json({
            success: true,
            message: "Booking Retrived successfully",
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
const updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const token = req.headers.authorization;
        const bearerToken = token?.split(" ")[1];
        const tokenDecode = jsonwebtoken_1.default.verify(bearerToken, config_1.config.secret_key);
        const booking = await booking_service_1.bookingService.updateBooking(bookingId, tokenDecode);
        const bookingDetails = booking;
        if (bookingDetails[0]?.status === "cancelled") {
            res.status(200).json({
                succes: true,
                message: "Booking cancelled successfully",
                data: bookingDetails
            });
        }
        else {
            res.status(200).json({
                succes: true,
                message: "Booking marked as returned. Vehicle is now available",
                data: bookingDetails
            });
        }
    }
    catch (error) {
    }
};
exports.bookingController = {
    createBooking,
    getAllBooking,
    updateBooking
};
