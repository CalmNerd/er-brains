import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import { sendError } from "../utils/api-response.js";
import { AppError } from "../utils/app-error.js";

function formatZodErrors(error: ZodError): Record<string, string> {
  const details: Record<string, string> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".") || "body";
    details[path] = issue.message;
  }

  return details;
}

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {
  if (error instanceof AppError) {
    return sendError(
      res,
      error.message,
      error.code,
      error.statusCode,
      error.details
    );
  }

  if (error instanceof ZodError) {
    return sendError(
      res,
      "Validation failed",
      "VALIDATION_ERROR",
      400,
      formatZodErrors(error)
    );
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return sendError(
      res,
      "Email already exists",
      "EMAIL_ALREADY_EXISTS",
      409
    );
  }

  console.error(error);

  return sendError(
    res,
    "Internal server error",
    "INTERNAL_SERVER_ERROR",
    500
  );
}
