"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const routes = (0, express_1.Router)();
routes.post("/", (0, auth_1.default)("admin", "customer"), booking_controller_1.bookingController.createBooking);
routes.get("/", (0, auth_1.default)("admin", "customer"), booking_controller_1.bookingController.getBooking);
routes.put("/:bookingId", (0, auth_1.default)("admin", "customer"), booking_controller_1.bookingController.updateBooking);
exports.bookingRoutes = routes;
