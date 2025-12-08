import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import sendResponse from "../../helper/sendResponse";

const createBooking = async (req: Request, res: Response) => {
  const body = req.body;

  const result = await bookingService.createBooking(body);

  const statusCode = result.success ? 201 : 406;

  sendResponse(res, statusCode, result);
};

export const bookingController = {
  createBooking,
};
