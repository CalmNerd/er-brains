import { z } from "zod"

/** Runtime + compile-time source of truth for task shapes. */
export const taskPrioritySchema = z.enum(["Low", "Medium", "High"])
export const taskStatusSchema = z.enum(["To Do", "In Progress", "Done"])

export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  priority: taskPrioritySchema,
  status: taskStatusSchema,
})

export const tasksSchema = z.array(taskSchema)

export type TaskPriority = z.infer<typeof taskPrioritySchema>
export type TaskStatus = z.infer<typeof taskStatusSchema>
export type Task = z.infer<typeof taskSchema>
export type TasksByStatus = Record<TaskStatus, Task[]>

export type TaskId = Task["id"]

/** Payload for creating a task (server assigns `id`). */
export type CreateTaskInput = Omit<Task, "id">

/** Partial updates keyed by task id — `id` itself is never patched in place. */
export type UpdateTaskInput = Partial<Omit<Task, "id">>

export type TaskPriorityChangeHandler = (
  taskId: TaskId,
  priority: TaskPriority
) => void

export type TaskStatusChangeHandler = (taskId: TaskId, status: TaskStatus) => void

export type TaskUpdateHandlers = {
  onPriorityChange: TaskPriorityChangeHandler
  onStatusChange: TaskStatusChangeHandler
}

export const TASK_PRIORITIES = taskPrioritySchema.options
export const TASK_STATUSES = taskStatusSchema.options

export function isTaskPriority(value: string): value is TaskPriority {
  return (TASK_PRIORITIES as readonly string[]).includes(value)
}

export function isTaskStatus(value: string | number): value is TaskStatus {
  return (TASK_STATUSES as readonly string[]).includes(String(value))
}

export function isTaskId(value: string | number): value is TaskId {
  return typeof value === "number" && Number.isInteger(value)
}

/** dnd-kit ids may be string or number; tasks always use numeric ids. */
export function isSameTaskId(
  dragId: string | number,
  taskId: TaskId
): boolean {
  return Number(dragId) === taskId
}
