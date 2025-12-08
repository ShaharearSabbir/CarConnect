"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const routes = (0, express_1.Router)();
routes.get("/", (0, auth_1.default)("admin"), user_controller_1.userController.getUsers);
routes.put("/:userId", (0, auth_1.default)("admin", "customer"), user_controller_1.userController.updateUser);
routes.delete("/:userId", (0, auth_1.default)("admin"), user_controller_1.userController.deleteUSer);
exports.userRoutes = routes;
