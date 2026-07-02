import type { Team } from "@prisma/client";

import type { TeamDto } from "./team.validation.js";

export function toTeamDto(team: Team): TeamDto {
  return {
    id: team.id,
    name: team.name,
    createdAt: team.createdAt.toISOString(),
    updatedAt: team.updatedAt.toISOString(),
  };
}
