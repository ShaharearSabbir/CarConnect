"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const booking_service_1 = require("./booking.service");
const sendResponse_1 = __importDefault(require("../../helper/sendResponse"));
const createBooking = async (req, res) => {
    const body = req.body;
    const result = await booking_service_1.bookingService.createBooking(body);
    const statusCode = result.success ? 201 : 406;
    (0, sendResponse_1.default)(res, statusCode, result);
};
const getBooking = async (req, res) => {
    try {
        const result = await booking_service_1.bookingService.getBooking(req.user);
        (0, sendResponse_1.default)(res, 200, {
            success: true,
            message: "Bookings retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, 500, { success: false, message: error.message });
    }
};
const updateBooking = async (req, res) => {
    const { bookingId } = req.params;
    const role = req.user?.role;
    const { status } = req.body;
    try {
        const result = await booking_service_1.bookingService.updateBooking(bookingId, role, status);
        (0, sendResponse_1.default)(res, 201, result);
    }
    catch (error) {
        (0, sendResponse_1.default)(res, 500, { success: false, message: error.message });
    }
};
exports.bookingController = {
    createBooking,
    getBooking,
    updateBooking,
};
