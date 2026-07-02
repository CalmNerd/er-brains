import { apiRequest } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/lib/tasks/types"

export type TaskListParams = {
  teamId: number
  status?: Task["status"]
  priority?: Task["priority"]
}

export type CreateTaskPayload = CreateTaskInput & {
  teamId: number
}

export async function listTasks(params: TaskListParams): Promise<Task[]> {
  return apiRequest<Task[]>(endpoints.tasks.list, {
    params,
  })
}

export async function getTask(taskId: number): Promise<Task> {
  return apiRequest<Task>(endpoints.tasks.byId(taskId))
}

export async function createTask(input: CreateTaskPayload): Promise<Task> {
  return apiRequest<Task>(endpoints.tasks.list, {
    method: "POST",
    data: input,
  })
}

export async function updateTask(
  taskId: number,
  input: UpdateTaskInput
): Promise<Task> {
  return apiRequest<Task>(endpoints.tasks.byId(taskId), {
    method: "PATCH",
    data: input,
  })
}

export async function deleteTask(taskId: number): Promise<{ id: number }> {
  return apiRequest<{ id: number }>(endpoints.tasks.byId(taskId), {
    method: "DELETE",
  })
}
