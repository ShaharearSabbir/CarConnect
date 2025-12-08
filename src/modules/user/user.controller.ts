import { Request, Response } from "express";
import sendResponse from "../../helper/sendResponse";
import { userService } from "./user.service";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsers();

    sendResponse(res, 200, {
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    sendResponse(res, 500, { success: false, message: error.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const body = req.body;
  const { userId } = req.params;

  if (req.user?.role === "customer") {
    if (userId != req.user.id) {
      return sendResponse(res, 403, {
        success: false,
        message: "forbidden access",
      });
    }
  }

  try {
    const result = await userService.updateUser(userId as string, body);

    const statusCode = result.success ? 201 : 404;
    sendResponse(res, statusCode, result);
  } catch (error: any) {
    sendResponse(res, 500, { success: false, message: error.message });
  }
};

const deleteUSer = async (req: Request, res: Response) => {
  const { userId } = req.params;

  //TODO check active bookings

  try {
    const result = userService.deleteUSer(userId as string);
    sendResponse(res, 201, {
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    sendResponse(res, 500, { success: true, message: error.message });
  }
};

export const userController = {
  getUsers,
  updateUser,
  deleteUSer,
};
