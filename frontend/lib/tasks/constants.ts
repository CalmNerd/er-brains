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
  {
    label: string
    defaultExpanded: boolean
    triggerClassName: string
  }
> = {
  "To Do": {
    label: "To Do",
    defaultExpanded: true,
    triggerClassName: "bg-muted/20 hover:bg-muted/40 border-border/10",
  },
  "In Progress": {
    label: "In Progress",
    defaultExpanded: true,
    triggerClassName:
      "bg-amber-200/10 hover:bg-amber-200/15 border-amber-200/5",
  },
  Done: {
    label: "Done",
    defaultExpanded: false,
    triggerClassName: "bg-blue-200/10 hover:bg-blue-200/15 border-blue-200/5",
  },
}
