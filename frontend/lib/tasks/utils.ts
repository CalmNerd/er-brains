import {
  formatCalendarDate,
  getLocalCalendarDate,
  parseCalendarDate,
} from "@/lib/dates/calendar-date"
import { STATUS_ORDER } from "@/lib/tasks/constants"
import type { TaskOrdering, TaskSortBy } from "@/lib/tasks/constants"
import { isSameTaskId, isTaskStatus } from "@/lib/tasks/schema"
import type { Task, TaskId, TaskPriority, TaskStatus } from "@/lib/tasks/types"

const PRIORITY_RANK: Record<TaskPriority, number> = {
  Urgent: 0,
  High: 1,
  Medium: 2,
  Low: 3,
}

function createEmptyManualOrder(): Record<TaskStatus, TaskId[]> {
  return STATUS_ORDER.reduce<Record<TaskStatus, TaskId[]>>(
    (acc, status) => {
      acc[status] = []
      return acc
    },
    {} as Record<TaskStatus, TaskId[]>
  )
}

/** Sorts tasks within a group. Status mode preserves caller order (manual). */
export function sortTasksByOrder<TTask extends Task>(
  tasks: TTask[],
  sortBy: TaskSortBy,
  ordering: TaskOrdering
): TTask[] {
  if (sortBy === "status") {
    return [...tasks]
  }

  const direction = ordering === "asc" ? 1 : -1

  if (sortBy === "priority") {
    return [...tasks].sort(
      (a, b) =>
        direction * (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
    )
  }

  return [...tasks].sort(
    (a, b) =>
      direction *
      (parseCalendarDate(a.dueDate).getTime() -
        parseCalendarDate(b.dueDate).getTime())
  )
}

/** Applies ordering to each status bucket without mutating the source. */
export function applyOrderToGrouped<TTask extends Task>(
  grouped: Record<TaskStatus, TTask[]>,
  sortBy: TaskSortBy,
  ordering: TaskOrdering
): Record<TaskStatus, TTask[]> {
  return STATUS_ORDER.reduce<Record<TaskStatus, TTask[]>>(
    (acc, status) => {
      acc[status] = sortTasksByOrder(grouped[status], sortBy, ordering)
      return acc
    },
    {} as Record<TaskStatus, TTask[]>
  )
}

/** Builds a stable signature of task ids grouped by status for sync effects. */
export function getTasksOrderSignature(tasks: Task[]): string {
  const grouped = groupTasksByStatus(tasks)

  return STATUS_ORDER.map((status) =>
    grouped[status].map((task) => `${task.id}:${task.status}`).join(",")
  ).join("|")
}

export function areManualOrdersEqual(
  left: Record<TaskStatus, TaskId[]>,
  right: Record<TaskStatus, TaskId[]>
): boolean {
  return STATUS_ORDER.every((status) => {
    const leftIds = left[status] ?? []
    const rightIds = right[status] ?? []

    if (leftIds.length !== rightIds.length) {
      return false
    }

    return leftIds.every((id, index) => id === rightIds[index])
  })
}

/** Builds manual order ids from the current API task list. */
export function buildManualOrderFromTasks<TTask extends Task>(
  tasks: TTask[]
): Record<TaskStatus, TaskId[]> {
  const grouped = groupTasksByStatus(tasks)

  return STATUS_ORDER.reduce<Record<TaskStatus, TaskId[]>>(
    (acc, status) => {
      acc[status] = grouped[status].map((task) => task.id)
      return acc
    },
    createEmptyManualOrder()
  )
}

/** Keeps manual order in sync when tasks are added or removed. */
export function syncManualOrder(
  manualOrder: Record<TaskStatus, TaskId[]>,
  tasks: Task[]
): Record<TaskStatus, TaskId[]> {
  const grouped = groupTasksByStatus(tasks)

  return STATUS_ORDER.reduce<Record<TaskStatus, TaskId[]>>(
    (acc, status) => {
      const validIds = new Set(grouped[status].map((task) => task.id))
      const kept = (manualOrder[status] ?? []).filter((id) => validIds.has(id))
      const keptSet = new Set(kept)
      const added = grouped[status]
        .filter((task) => !keptSet.has(task.id))
        .map((task) => task.id)

      acc[status] = [...kept, ...added]
      return acc
    },
    createEmptyManualOrder()
  )
}

/** Applies saved manual order within each status bucket. */
export function applyManualOrderToGrouped<TTask extends Task>(
  grouped: Record<TaskStatus, TTask[]>,
  manualOrder: Record<TaskStatus, TaskId[]>
): Record<TaskStatus, TTask[]> {
  return STATUS_ORDER.reduce<Record<TaskStatus, TTask[]>>(
    (acc, status) => {
      const tasks = grouped[status]
      const order = manualOrder[status] ?? []
      const byId = new Map(tasks.map((task) => [task.id, task]))
      const ordered = order
        .map((id) => byId.get(id))
        .filter((task): task is TTask => task !== undefined)
      const orderedIds = new Set(ordered.map((task) => task.id))
      const remaining = tasks.filter((task) => !orderedIds.has(task.id))

      acc[status] = [...ordered, ...remaining]
      return acc
    },
    {} as Record<TaskStatus, TTask[]>
  )
}

export function reorderManualOrder(
  manualOrder: Record<TaskStatus, TaskId[]>,
  status: TaskStatus,
  fromIndex: number,
  toIndex: number
): Record<TaskStatus, TaskId[]> {
  const ids = [...(manualOrder[status] ?? [])]
  const [moved] = ids.splice(fromIndex, 1)

  if (moved === undefined) {
    return manualOrder
  }

  ids.splice(toIndex, 0, moved)

  return {
    ...manualOrder,
    [status]: ids,
  }
}

export function moveTaskInManualOrder(
  manualOrder: Record<TaskStatus, TaskId[]>,
  taskId: TaskId,
  fromStatus: TaskStatus,
  toStatus: TaskStatus,
  toIndex: number
): Record<TaskStatus, TaskId[]> {
  const fromIds = (manualOrder[fromStatus] ?? []).filter((id) => id !== taskId)
  const toIds = [...(manualOrder[toStatus] ?? [])]
  const insertIndex = Math.max(0, Math.min(toIndex, toIds.length))

  toIds.splice(insertIndex, 0, taskId)

  return {
    ...manualOrder,
    [fromStatus]: fromIds,
    [toStatus]: toIds,
  }
}

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

/** Formats a calendar date (YYYY-MM-DD) for compact list display (e.g. "12 Mar"). */
export function formatDueDate(isoDate: string): string {
  return formatCalendarDate(isoDate)
}

/** Past due date for active statuses (To Do / In Progress). */
export function isTaskDueDateOverdue(task: Task): boolean {
  if (task.status !== "To Do" && task.status !== "In Progress") {
    return false
  }

  return task.dueDate < getLocalCalendarDate()
}

/** Builds a Linear-style task identifier from the numeric id. */
export function formatTaskId(id: TaskId): string {
  if (id < 0) {
    return "TSK-00"
  }

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
