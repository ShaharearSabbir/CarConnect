"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const sendResponse_1 = __importDefault(require("../../helper/sendResponse"));
const auth_service_1 = require("./auth.service");
const createUser = async (req, res) => {
    const body = req.body;
    const { password } = body;
    if (password.length < 6) {
        (0, sendResponse_1.default)(res, 500, { success: false, message: "password is too weak" });
    }
    try {
        const result = await auth_service_1.authServices.createUser(body);
        (0, sendResponse_1.default)(res, 201, {
            success: true,
            message: "User registered successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, 500, { success: false, message: error.message });
    }
};
const loginUser = async (req, res) => {
    const body = req.body;
    try {
        const result = await auth_service_1.authServices.loginUser(body);
        if (!result.success) {
            (0, sendResponse_1.default)(res, 500, result);
        }
        (0, sendResponse_1.default)(res, 200, result);
    }
    catch (error) {
        (0, sendResponse_1.default)(res, 500, { success: false, message: error.message });
    }
};
exports.authController = {
    createUser,
    loginUser,
};
