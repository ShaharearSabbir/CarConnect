import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";
import sendResponse from "../../helper/sendResponse";

const addVehicle = async (req: Request, res: Response) => {
  const body = req.body;

  try {
    const result = await vehicleService.addVehicle(body);

    sendResponse(res, 201, {
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, 500, { success: false, message: error.message });
  }
};

const getVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getVehicle();

    sendResponse(res, 200, {
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    sendResponse(res, 500, { success: false, message: error });
  }
};

export const vehicleController = {
  addVehicle,
  getVehicle,
};
