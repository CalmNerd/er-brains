import type { Request, Response } from "express";

import { sendSuccess } from "../../utils/api-response.js";
import { AppError } from "../../utils/app-error.js";
import * as aiService from "./ai.service.js";
import { aiSuggestRequestSchema } from "./ai.validation.js";

export async function suggest(req: Request, res: Response): Promise<Response> {
  if (!req.user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const input = aiSuggestRequestSchema.parse(req.body);
  const suggestion = await aiService.suggestTask(input);

  return sendSuccess(res, "AI suggestion generated successfully", suggestion);
}
