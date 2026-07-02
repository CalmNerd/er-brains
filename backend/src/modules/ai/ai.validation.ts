import { z } from "zod";

import { taskPrioritySchema } from "../tasks/task.validation.js";

export const aiSuggestRequestSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
  })
  .refine((data) => Boolean(data.title || data.description), {
    message: "At least one of title or description is required",
  });

export const aiSuggestResponseSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().min(1),
  priority: taskPrioritySchema,
});

export type AiSuggestRequest = z.infer<typeof aiSuggestRequestSchema>;
export type AiSuggestResponse = z.infer<typeof aiSuggestResponseSchema>;
