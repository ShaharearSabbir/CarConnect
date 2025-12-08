import express, { Request, Response } from "express";
import config from "./config";
import sendResponse from "./helper/sendResponse";
import initDB from "./config/db";
import { authRouter } from "./modules/auth/auth.routes";
import { vehicleRouter } from "./modules/vehicle/vehicle.routes";
import { userRoutes } from "./modules/user/user.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";

const app = express();

app.use(express.json());

// Initialize database
initDB();

app.get("/", (req: Request, res: Response) => {
  sendResponse(res, 200, {
    success: true,
    message: `${config.APP_NAME} server is running`,
  });
});

// Auth
app.use("/api/v1/auth", authRouter);

// Vehicle
app.use("/api/v1/vehicles", vehicleRouter);

// User
app.use("/api/v1/users", userRoutes);

// Booking
app.use("/api/v1/bookings", bookingRoutes);

app.use((req: Request, res: Response) => {
  sendResponse(res, 404, {
    success: false,
    message: `${req.path} is not a valid route. Please visit https://github.com/ShaharearSabbir/CarConnect for documentation`,
    path: req.path,
  });
});

export default app;
