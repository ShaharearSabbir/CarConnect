"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
};
exports.default = sendResponse;
