"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleController = void 0;
const vehicle_service_1 = require("./vehicle.service");
// vehicle created only on role admin
const VehicleCreate = async (req, res) => {
    try {
        const result = await vehicle_service_1.vehicleService.VehicleCreate(req.body);
        // console.log(result);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
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
// get all vehicle public
const getAllVehicle = async (req, res) => {
    try {
        const result = await vehicle_service_1.vehicleService.getAllVehicle();
        // console.log(result);
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
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
// getAllVehicleById role:public
const getVehicleById = async (req, res) => {
    const id = req.params.vehicleId;
    try {
        const result = await vehicle_service_1.vehicleService.getVehicleById(id);
        // console.log(result);
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
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
// update vehicle role:admin
const updateVehicleById = async (req, res) => {
    const id = req.params.vehicleId;
    try {
        const result = await vehicle_service_1.vehicleService.updateVehicleById(req.body, id);
        // console.log(result);
        res.status(200).json({
            success: true,
            message: "Vehicle Updated successfully",
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
const deleteAVehicleByAdmin = async (req, res) => {
    try {
        const result = await vehicle_service_1.vehicleService.deleteAVehicleByAdmin(req.params.vehicleId, req.headers.authorization);
        // console.log(result);
        res.status(200).json({
            success: true,
            message: "Vehicle Deleted successfully",
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
exports.vehicleController = {
    VehicleCreate,
    getAllVehicle,
    getVehicleById,
    updateVehicleById,
    deleteAVehicleByAdmin
};
