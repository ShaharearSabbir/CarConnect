"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const sendResponse_1 = __importDefault(require("./helper/sendResponse"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = require("./modules/auth/auth.routes");
const vehicle_routes_1 = require("./modules/vehicle/vehicle.routes");
const user_routes_1 = require("./modules/user/user.routes");
const booking_routes_1 = require("./modules/booking/booking.routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Initialize database
(0, db_1.default)();
app.get("/", (req, res) => {
    (0, sendResponse_1.default)(res, 200, {
        success: true,
        message: `${config_1.default.APP_NAME} server is running`,
    });
});
// Auth
app.use("/api/v1/auth", auth_routes_1.authRouter);
// Vehicle
app.use("/api/v1/vehicles", vehicle_routes_1.vehicleRouter);
// User
app.use("/api/v1/users", user_routes_1.userRoutes);
// Booking
app.use("/api/v1/bookings", booking_routes_1.bookingRoutes);
app.use((req, res) => {
    (0, sendResponse_1.default)(res, 404, {
        success: false,
        message: `${req.path} is not a valid route. Please visit https://github.com/ShaharearSabbir/CarConnect for documentation`,
        path: req.path,
    });
});
exports.default = app;
