import type { Response } from "express";

type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

type ErrorResponse = {
  success: false;
  message: string;
  error: {
    code: string;
    details?: Record<string, string>;
  };
};

export function sendSuccess<T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 200
): Response<SuccessResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  res: Response,
  message: string,
  code: string,
  statusCode = 400,
  details?: Record<string, string>
): Response<ErrorResponse> {
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      ...(details ? { details } : {}),
    },
  });
}
