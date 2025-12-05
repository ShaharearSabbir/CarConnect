import { Request, Response } from "express";
import sendResponse from "../../helper/sendResponse";
import { authServices } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const result = await authServices.createUser(body);

    sendResponse(res, 201, {
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, 500, { success: false, message: error.message });
  }
};

export const authController = {
  createUser,
};
