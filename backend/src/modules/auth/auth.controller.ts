import type { Request, Response } from "express";

import { sendSuccess } from "../../utils/api-response.js";
import { AppError } from "../../utils/app-error.js";
import * as authService from "./auth.service.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

export async function signup(req: Request, res: Response): Promise<Response> {
  const input = signupSchema.parse(req.body);
  const result = await authService.signup(input);

  return sendSuccess(res, "Account created successfully", result, 201);
}

export async function login(req: Request, res: Response): Promise<Response> {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);

  return sendSuccess(res, "Logged in successfully", result);
}

export async function me(req: Request, res: Response): Promise<Response> {
  if (!req.user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const user = await authService.getMe(req.user.id);

  return sendSuccess(res, "User fetched successfully", user);
}
