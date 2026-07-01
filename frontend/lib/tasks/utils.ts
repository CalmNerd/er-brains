import { STATUS_ORDER } from "@/lib/tasks/constants"
import { isSameTaskId, isTaskStatus } from "@/lib/tasks/schema"
import type { Task, TaskId, TaskStatus } from "@/lib/tasks/types"

/** Groups a flat task list into status buckets preserving order within each group. */
export function groupTasksByStatus<TTask extends Task = Task>(
  tasks: TTask[]
): Record<TaskStatus, TTask[]> {
  const grouped = STATUS_ORDER.reduce<Record<TaskStatus, TTask[]>>(
    (acc, status) => {
      acc[status] = []
      return acc
    },
    {} as Record<TaskStatus, TTask[]>
  )

  for (const task of tasks) {
    grouped[task.status].push(task)
  }

  return grouped
}

/** Flattens grouped tasks back into a single array in status order. */
export function flattenTasksByStatus<TTask extends Task = Task>(
  grouped: Record<TaskStatus, TTask[]>
): TTask[] {
  return STATUS_ORDER.flatMap((status) => grouped[status])
}

/** Formats an ISO date string for compact list display (e.g. "Dec 2025"). */
export function formatDueDate(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

/** Builds a Linear-style task identifier from the numeric id. */
export function formatTaskId(id: TaskId): string {
  return `TSK-${id}`
}

/** Resolves which status container owns a drag item (status id or task id). */
export function findTaskContainer<TTask extends Task = Task>(
  id: string | number,
  grouped: Record<TaskStatus, TTask[]>
): TaskStatus | null {
  if (isTaskStatus(id)) {
    return id
  }

  for (const status of STATUS_ORDER) {
    if (grouped[status].some((task) => isSameTaskId(id, task.id))) {
      return status
    }
  }

  return null
}

export function findTaskById<TTask extends Task = Task>(
  taskId: TaskId,
  grouped: Record<TaskStatus, TTask[]>
): TTask | undefined {
  for (const status of STATUS_ORDER) {
    const task = grouped[status].find((item) => item.id === taskId)
    if (task) return task
  }

  return undefined
}
