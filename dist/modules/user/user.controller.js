"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const sendResponse_1 = __importDefault(require("../../helper/sendResponse"));
const user_service_1 = require("./user.service");
const getUsers = async (req, res) => {
    try {
        const result = await user_service_1.userService.getUsers();
        (0, sendResponse_1.default)(res, 200, {
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, 500, { success: false, message: error.message });
    }
};
const updateUser = async (req, res) => {
    const body = req.body;
    const { userId } = req.params;
    if (req.user?.role === "customer") {
        if (userId != req.user.id) {
            return (0, sendResponse_1.default)(res, 403, {
                success: false,
                message: "forbidden access",
            });
        }
    }
    try {
        const result = await user_service_1.userService.updateUser(userId, body);
        const statusCode = result.success ? 201 : 404;
        (0, sendResponse_1.default)(res, statusCode, result);
    }
    catch (error) {
        (0, sendResponse_1.default)(res, 500, { success: false, message: error.message });
    }
};
const deleteUSer = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await user_service_1.userService.deleteUSer(userId);
        const statusCode = result.success ? 201 : 406;
        (0, sendResponse_1.default)(res, statusCode, result);
    }
    catch (error) {
        (0, sendResponse_1.default)(res, 500, { success: true, message: error.message });
    }
};
exports.userController = {
    getUsers,
    updateUser,
    deleteUSer,
};
