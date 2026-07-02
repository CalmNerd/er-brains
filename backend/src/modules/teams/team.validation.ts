import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().trim().min(1, "Team name is required"),
});

export const updateTeamSchema = z.object({
  name: z.string().trim().min(1, "Team name is required"),
});

export const teamIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const teamSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type TeamDto = z.infer<typeof teamSchema>;
