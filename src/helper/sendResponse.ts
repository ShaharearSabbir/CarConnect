import { Response } from "express";

const sendResponse = (
  res: Response,
  statusCode: number,
  data: Record<string, unknown>
) => {
  res.status(statusCode).json(data);
};

export default sendResponse;
