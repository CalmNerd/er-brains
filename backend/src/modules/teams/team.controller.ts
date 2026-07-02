import type { Request, Response } from "express";

import { sendSuccess } from "../../utils/api-response.js";
import { AppError } from "../../utils/app-error.js";
import * as teamService from "./team.service.js";
import {
  createTeamSchema,
  teamIdParamSchema,
  updateTeamSchema,
} from "./team.validation.js";

export async function listTeams(req: Request, res: Response): Promise<Response> {
  if (!req.user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const teams = await teamService.listTeams(req.user.id);

  return sendSuccess(res, "Teams fetched successfully", teams);
}

export async function createTeam(
  req: Request,
  res: Response
): Promise<Response> {
  if (!req.user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const input = createTeamSchema.parse(req.body);
  const team = await teamService.createTeam(req.user.id, input);

  return sendSuccess(res, "Team created successfully", team, 201);
}

export async function updateTeam(
  req: Request,
  res: Response
): Promise<Response> {
  if (!req.user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const { id } = teamIdParamSchema.parse(req.params);
  const input = updateTeamSchema.parse(req.body);
  const team = await teamService.updateTeam(req.user.id, id, input);

  return sendSuccess(res, "Team updated successfully", team);
}

export async function deleteTeam(
  req: Request,
  res: Response
): Promise<Response> {
  if (!req.user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const { id } = teamIdParamSchema.parse(req.params);
  const result = await teamService.deleteTeam(req.user.id, id);

  return sendSuccess(res, "Team deleted successfully", result);
}
