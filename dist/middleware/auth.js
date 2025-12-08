"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse_1 = __importDefault(require("../helper/sendResponse"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return (0, sendResponse_1.default)(res, 401, {
                    success: false,
                    message: "unauthorized access",
                });
            }
            const token = authHeader?.split(" ")[1];
            if (!token) {
                return (0, sendResponse_1.default)(res, 401, {
                    success: false,
                    message: "unauthorized access",
                });
            }
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
            if (roles.length && !roles.includes(decoded.role)) {
                return (0, sendResponse_1.default)(res, 403, {
                    success: false,
                    message: "forbidden access",
                });
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            (0, sendResponse_1.default)(res, 500, { success: false, message: error.message });
        }
    };
};
exports.default = auth;
