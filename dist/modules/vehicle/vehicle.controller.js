"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleController = void 0;
const vehicle_service_1 = require("./vehicle.service");
const sendResponse_1 = __importDefault(require("../../helper/sendResponse"));
const addVehicle = async (req, res) => {
    const body = req.body;
    try {
        const result = await vehicle_service_1.vehicleService.addVehicle(body);
        (0, sendResponse_1.default)(res, 201, {
            success: true,
            message: "Vehicle created successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, 500, { success: false, message: error.message });
    }
};
const getVehicle = async (req, res) => {
    try {
        const result = await vehicle_service_1.vehicleService.getVehicle();
        (0, sendResponse_1.default)(res, 200, {
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, 500, { success: false, message: error });
    }
};
const getSingleVehicle = async (req, res) => {
    const { vehicleId } = req.params;
    try {
        const result = await vehicle_service_1.vehicleService.getSingleVehicle(vehicleId);
        if (!result.rowCount) {
            return (0, sendResponse_1.default)(res, 200, {
                success: false,
                message: `no vehicle with id ${vehicleId}`,
            });
        }
        (0, sendResponse_1.default)(res, 200, {
            success: true,
            message: "Vehicle retrieved successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, 500, { success: false, message: error.message });
    }
};
const updateVehicle = async (req, res) => {
    const { vehicleId } = req.params;
    const body = req.body;
    try {
        const result = await vehicle_service_1.vehicleService.updateVehicle(vehicleId, body);
        const statusCode = result.success ? 201 : 404;
        (0, sendResponse_1.default)(res, statusCode, result);
    }
    catch (error) {
        (0, sendResponse_1.default)(res, 500, { success: false, message: error.message });
    }
};
const deleteVehicle = async (req, res) => {
    const { vehicleId } = req.params;
    try {
        const result = await vehicle_service_1.vehicleService.deleteVehicle(vehicleId);
        const statusCode = result.success ? 201 : 404;
        (0, sendResponse_1.default)(res, statusCode, result);
    }
    catch (error) {
        (0, sendResponse_1.default)(res, 500, { success: false, message: error.message });
    }
};
exports.vehicleController = {
    addVehicle,
    getVehicle,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
};
