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

const getSingleVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  try {
    const result = await vehicleService.getSingleVehicle(vehicleId as string);

    if (!result.rowCount) {
      return sendResponse(res, 200, {
        success: false,
        message: `no vehicle with id ${vehicleId}`,
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, 500, { success: false, message: error.message });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const body = req.body;

  try {
    const result = await vehicleService.updateVehicle(
      vehicleId as string,
      body
    );

    const statusCode = result.success ? 201 : 404;

    sendResponse(res, statusCode, result);
  } catch (error: any) {
    sendResponse(res, 500, { success: false, message: error.message });
  }
};

export const vehicleController = {
  addVehicle,
  getVehicle,
  getSingleVehicle,
  updateVehicle,
};
