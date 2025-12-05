import express, { Request, Response } from "express";
import config from "./config";
import sendResponse from "./helper/sendResponse";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  sendResponse(res, 200, {
    success: true,
    message: `${config.APP_NAME} server is running`,
  });
});

export default app;
