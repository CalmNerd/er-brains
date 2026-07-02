import { z } from "zod"

export const teamSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const teamsSchema = z.array(teamSchema)

export const createTeamSchema = z.object({
  name: z.string().trim().min(1, "Team name is required"),
})

export const updateTeamSchema = z.object({
  name: z.string().trim().min(1, "Team name is required"),
})

export type Team = z.infer<typeof teamSchema>
export type CreateTeamInput = z.infer<typeof createTeamSchema>
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>
