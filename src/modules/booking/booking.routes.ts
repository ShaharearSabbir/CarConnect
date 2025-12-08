import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const routes = Router();

routes.post("/", auth("admin", "customer"), bookingController.createBooking);

export const bookingRoutes = routes;
