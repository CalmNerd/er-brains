import type { Task } from "@prisma/client";

import type { TaskDto } from "./task.validation.js";

/** Serializes a UTC-midnight Date to YYYY-MM-DD without local timezone drift. */
function formatDueDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
