import { TASK_STATUSES } from "@/lib/tasks/schema"
import type { TaskStatus } from "@/lib/tasks/types"

export const STATUS_ORDER = [...TASK_STATUSES] satisfies TaskStatus[]

export const ACTIVE_STATUSES = STATUS_ORDER.filter(
  (status): status is Exclude<TaskStatus, "Done"> => status !== "Done"
)

export type TaskView = "all" | "active"

export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; defaultExpanded: boolean }
> = {
  "To Do": { label: "To Do", defaultExpanded: true },
  "In Progress": { label: "In Progress", defaultExpanded: true },
  Done: { label: "Done", defaultExpanded: false },
}
