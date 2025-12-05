import { NextFunction, Request, Response } from "express";
import sendResponse from "../helper/sendResponse";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return sendResponse(res, 401, {
          success: false,
          message: "unauthorized access",
        });
      }

      const token = authHeader?.split(" ")[1];

      if (!token) {
        return sendResponse(res, 401, {
          success: false,
          message: "unauthorized access",
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.JWT_SECRET
      ) as JwtPayload;

      if (roles.length && !roles.includes(decoded.role)) {
        return sendResponse(res, 403, {
          success: false,
          message: "forbidden access",
        });
      }

      req.user = decoded;
      next();
    } catch (error: any) {
      sendResponse(res, 500, { success: false, message: error.message });
    }
  };
};

export default auth;
