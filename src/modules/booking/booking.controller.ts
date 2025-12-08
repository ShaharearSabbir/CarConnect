import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import sendResponse from "../../helper/sendResponse";

const createBooking = async (req: Request, res: Response) => {
  const body = req.body;

  const result = await bookingService.createBooking(body);

  const statusCode = result.success ? 201 : 406;

  sendResponse(res, statusCode, result);
};

const getBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.getBooking(req.user!);
    sendResponse(res, 200, {
      success: true,
      message: "Bookings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, 500, { success: false, message: error.message });
  }
};

export const bookingController = {
  createBooking,
  getBooking,
};
