"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
const envVariables = [
    "APP_NAME",
    "VERSION",
    "PORT",
    "CONNECTION_STR",
    "JWT_SECRET",
];
let config = {};
envVariables.forEach((env) => {
    if (typeof process.env[env] !== "string") {
        throw new Error(`Please add ${env} on environment variables`);
    }
    config[env] = process.env[env];
});
exports.default = config;
