import { z } from "zod";

export const taskPrioritySchema = z.enum(["Urgent", "High", "Medium", "Low"]);
export const taskStatusSchema = z.enum(["To Do", "In Progress", "Done"]);

export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  priority: taskPrioritySchema,
  status: taskStatusSchema,
});

export const createTaskSchema = z.object({
  teamId: z.number().int().positive(),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().default(""),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be YYYY-MM-DD"),
  priority: taskPrioritySchema,
  status: taskStatusSchema.default("To Do"),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").optional(),
    description: z.string().optional(),
    dueDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be YYYY-MM-DD")
      .optional(),
    priority: taskPrioritySchema.optional(),
    status: taskStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const taskQuerySchema = z.object({
  teamId: z.coerce.number().int().positive(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
});

export const taskIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type TaskDto = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
