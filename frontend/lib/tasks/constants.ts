import { TASK_STATUSES } from "@/lib/tasks/schema"
import type { TaskStatus } from "@/lib/tasks/types"

export const STATUS_ORDER = [...TASK_STATUSES] satisfies TaskStatus[]

export const ACTIVE_STATUSES = STATUS_ORDER.filter(
  (status): status is Exclude<TaskStatus, "Done"> => status !== "Done"
)

export type TaskView = "all" | "active"

export type TaskLayout = "list" | "board"

export type TaskOrderBy = "status" | "priority" | "dueDate"

export type TaskSortDirection = "asc" | "desc"

export const TASK_LAYOUT_OPTIONS: { value: TaskLayout; label: string }[] = [
  { value: "list", label: "List" },
  { value: "board", label: "Board" },
]

export const TASK_ORDER_OPTIONS: { value: TaskOrderBy; label: string }[] = [
  { value: "status", label: "Status" },
  { value: "priority", label: "Priority" },
  { value: "dueDate", label: "Due date" },
]

export const TASK_SORT_DIRECTION_OPTIONS: {
  value: TaskSortDirection
  label: string
}[] = [
  { value: "asc", label: "Asc" },
  { value: "desc", label: "Desc" },
]

export const DEFAULT_TASK_FILTERS = {
  view: "all",
  layout: "list",
  orderBy: "status",
  sortDirection: "asc",
} as const satisfies {
  view: TaskView
  layout: TaskLayout
  orderBy: TaskOrderBy
  sortDirection: TaskSortDirection
}

/** Manual drag-and-drop is only available when ordering by status. */
export function isManualTaskOrder(orderBy: TaskOrderBy): boolean {
  return orderBy === "status"
}

/** Column hint shown when automatic sorting disables drag-and-drop. */
export function getOrderByColumnLabel(orderBy: TaskOrderBy): string | null {
  if (orderBy === "priority") {
    return "Ordered by priority"
  }

  if (orderBy === "dueDate") {
    return "Ordered by due date"
  }

  return null
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
