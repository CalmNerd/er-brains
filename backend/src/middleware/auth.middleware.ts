import type { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/app-error.js";
import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
    return;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const { userId } = verifyToken(token);
    req.user = { id: userId };
    next();
  } catch {
    next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
  }
}
