import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/app-error.js";
import { toTeamDto } from "./team.mapper.js";
import type { CreateTeamInput, UpdateTeamInput } from "./team.validation.js";

export const DEFAULT_TEAM_NAME = "My Team";

export async function assertTeamOwnedByUser(userId: number, teamId: number) {
  const team = await prisma.team.findFirst({
    where: { id: teamId, userId },
  });

  if (!team) {
    throw new AppError("Team not found", 404, "TEAM_NOT_FOUND");
  }

  return team;
}

export async function getDefaultTeamForUser(userId: number) {
  const team = await prisma.team.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  if (!team) {
    throw new AppError("Team not found", 404, "TEAM_NOT_FOUND");
  }

  return team;
}

export async function listTeams(userId: number) {
  const teams = await prisma.team.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  return teams.map(toTeamDto);
}

export async function createTeam(userId: number, input: CreateTeamInput) {
  const team = await prisma.team.create({
    data: {
      name: input.name,
      userId,
    },
  });

  return toTeamDto(team);
}

export async function updateTeam(
  userId: number,
  teamId: number,
  input: UpdateTeamInput
) {
  await assertTeamOwnedByUser(userId, teamId);

  const team = await prisma.team.update({
    where: { id: teamId },
    data: { name: input.name },
  });

  return toTeamDto(team);
}

export async function deleteTeam(userId: number, teamId: number) {
  await assertTeamOwnedByUser(userId, teamId);

  await prisma.team.delete({
    where: { id: teamId },
  });

  return { id: teamId };
}
