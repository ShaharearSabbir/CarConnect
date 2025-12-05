import express, { Request, Response } from "express";
import config from "./config";
import sendResponse from "./helper/sendResponse";
import initDB from "./config/db";
import { authRouter } from "./modules/auth/auth.routes";

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

app.use("/api/v1/auth", authRouter);

app.use((req: Request, res: Response) => {
  sendResponse(res, 404, {
    success: false,
    message: `${req.path} is not a valid route. Please visit https://github.com/ShaharearSabbir/CarConnect for documentation`,
    path: req.path,
  });
});

export default app;
