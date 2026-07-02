import { z } from "zod";

import { taskPrioritySchema } from "../tasks/task.validation.js";

export const aiSuggestRequestSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
});

export const aiSuggestResponseSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().min(1),
  priority: taskPrioritySchema,
});

export type AiSuggestRequest = z.infer<typeof aiSuggestRequestSchema>;
export type AiSuggestResponse = z.infer<typeof aiSuggestResponseSchema>;
