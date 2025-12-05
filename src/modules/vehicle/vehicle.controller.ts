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

export const vehicleController = {
  addVehicle,
};
