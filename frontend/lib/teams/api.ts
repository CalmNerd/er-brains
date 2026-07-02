import { apiRequest } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import type {
  CreateTeamInput,
  Team,
  UpdateTeamInput,
} from "@/lib/teams/types"

export async function listTeams(): Promise<Team[]> {
  return apiRequest<Team[]>(endpoints.teams.list)
}

export async function createTeam(input: CreateTeamInput): Promise<Team> {
  return apiRequest<Team>(endpoints.teams.list, {
    method: "POST",
    data: input,
  })
}

export async function updateTeam(
  teamId: number,
  input: UpdateTeamInput
): Promise<Team> {
  return apiRequest<Team>(endpoints.teams.byId(teamId), {
    method: "PATCH",
    data: input,
  })
}

export async function deleteTeam(teamId: number): Promise<{ id: number }> {
  return apiRequest<{ id: number }>(endpoints.teams.byId(teamId), {
    method: "DELETE",
  })
}
