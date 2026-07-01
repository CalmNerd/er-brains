import { TASK_STATUSES } from "@/lib/tasks/schema"
import type { TaskStatus } from "@/lib/tasks/types"

export const STATUS_ORDER = [...TASK_STATUSES] satisfies TaskStatus[]

export const ACTIVE_STATUSES = STATUS_ORDER.filter(
  (status): status is Exclude<TaskStatus, "Done"> => status !== "Done"
)

export type TaskView = "all" | "active"

export type TaskLayout = "list" | "board"

export type TaskOrderBy = "status" | "priority"

export const TASK_LAYOUT_OPTIONS: { value: TaskLayout; label: string }[] = [
  { value: "list", label: "List" },
  { value: "board", label: "Board" },
]

export const TASK_ORDER_OPTIONS: { value: TaskOrderBy; label: string }[] = [
  { value: "status", label: "Status" },
  { value: "priority", label: "Priority" },
]

export const DEFAULT_TASK_FILTERS = {
  view: "all",
  layout: "list",
  orderBy: "status",
} as const satisfies {
  view: TaskView
  layout: TaskLayout
  orderBy: TaskOrderBy
}

export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; defaultExpanded: boolean }
> = {
  "To Do": { label: "To Do", defaultExpanded: true },
  "In Progress": { label: "In Progress", defaultExpanded: true },
  Done: { label: "Done", defaultExpanded: false },
}
