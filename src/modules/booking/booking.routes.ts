import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const routes = Router();

routes.post("/", auth("admin", "customer"), bookingController.createBooking);
routes.get("/", auth("admin", "customer"), bookingController.getBooking);

export const bookingRoutes = routes;
