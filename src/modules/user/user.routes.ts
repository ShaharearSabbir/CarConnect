import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const routes = Router();

routes.get("/", auth("admin"), userController.getUsers);
routes.put("/:userId", auth("admin", "customer"), userController.updateUser);

export const userRoutes = routes;
