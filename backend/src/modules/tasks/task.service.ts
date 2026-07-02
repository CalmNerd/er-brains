import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/app-error.js";
import { getDefaultTeamForUser } from "../teams/team.service.js";
import { parseDueDate, toTaskDto } from "./task.mapper.js";
import type {
  CreateTaskInput,
  TaskQueryInput,
  UpdateTaskInput,
} from "./task.validation.js";

export async function listTasks(userId: number, query: TaskQueryInput) {
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.priority ? { priority: query.priority } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return tasks.map(toTaskDto);
}

export async function getTaskById(userId: number, taskId: number) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new AppError("Task not found", 404, "TASK_NOT_FOUND");
  }

  return toTaskDto(task);
}

export async function createTask(userId: number, input: CreateTaskInput) {
  const defaultTeam = await getDefaultTeamForUser(userId);

  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      dueDate: parseDueDate(input.dueDate),
      priority: input.priority,
      status: input.status,
      userId,
      teamId: defaultTeam.id,
    },
  });

  return toTaskDto(task);
}

export async function updateTask(
  userId: number,
  taskId: number,
  input: UpdateTaskInput
) {
  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existing) {
    throw new AppError("Task not found", 404, "TASK_NOT_FOUND");
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.dueDate !== undefined
        ? { dueDate: parseDueDate(input.dueDate) }
        : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    },
  });

  return toTaskDto(task);
}

export async function deleteTask(userId: number, taskId: number) {
  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existing) {
    throw new AppError("Task not found", 404, "TASK_NOT_FOUND");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });
}
