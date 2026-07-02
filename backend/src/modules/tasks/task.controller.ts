import type { Request, Response } from "express";

import { sendSuccess } from "../../utils/api-response.js";
import { AppError } from "../../utils/app-error.js";
import * as taskService from "./task.service.js";
import {
  createTaskSchema,
  taskIdParamSchema,
  taskQuerySchema,
  updateTaskSchema,
} from "./task.validation.js";

export async function listTasks(req: Request, res: Response): Promise<Response> {
  if (!req.user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const query = taskQuerySchema.parse(req.query);
  const tasks = await taskService.listTasks(req.user.id, query);

  return sendSuccess(res, "Tasks fetched successfully", tasks);
}

export async function getTask(req: Request, res: Response): Promise<Response> {
  if (!req.user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const { id } = taskIdParamSchema.parse(req.params);
  const task = await taskService.getTaskById(req.user.id, id);

  return sendSuccess(res, "Task fetched successfully", task);
}

export async function createTask(
  req: Request,
  res: Response
): Promise<Response> {
  if (!req.user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const input = createTaskSchema.parse(req.body);
  const task = await taskService.createTask(req.user.id, input);

  return sendSuccess(res, "Task created successfully", task, 201);
}

export async function updateTask(
  req: Request,
  res: Response
): Promise<Response> {
  if (!req.user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const { id } = taskIdParamSchema.parse(req.params);
  const input = updateTaskSchema.parse(req.body);
  const task = await taskService.updateTask(req.user.id, id, input);

  return sendSuccess(res, "Task updated successfully", task);
}

export async function deleteTask(
  req: Request,
  res: Response
): Promise<Response> {
  if (!req.user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const { id } = taskIdParamSchema.parse(req.params);
  await taskService.deleteTask(req.user.id, id);

  return sendSuccess(res, "Task deleted successfully", { id });
}
