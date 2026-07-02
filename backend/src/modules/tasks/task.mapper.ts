import type { Task } from "@prisma/client";

import type { TaskDto } from "./task.validation.js";

function formatDueDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function toTaskDto(task: Task): TaskDto {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: formatDueDate(task.dueDate),
    priority: task.priority as TaskDto["priority"],
    status: task.status as TaskDto["status"],
  };
}

export function parseDueDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}
