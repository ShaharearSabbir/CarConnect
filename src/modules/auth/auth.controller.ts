import { Request, Response } from "express";
import sendResponse from "../../helper/sendResponse";
import { authServices } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  const body = req.body;
  const { password } = body;

  if ((password as string).length < 6) {
    sendResponse(res, 500, { success: false, message: "password is too weak" });
  }

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

const loginUser = async (req: Request, res: Response) => {
  const body = req.body;

  try {
    const result = await authServices.loginUser(body);

    if (!result.success) {
      sendResponse(res, 500, result);
    }

    sendResponse(res, 201, result);
  } catch (error: any) {
    sendResponse(res, 500, { success: false, message: error.message });
  }
};

export const authController = {
  createUser,
  loginUser,
};
