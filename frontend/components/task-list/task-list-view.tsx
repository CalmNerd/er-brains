"use client"

import { TaskStatusSection } from "@/components/task-list/task-status-section"
import type { Task, TaskStatus, TaskUpdateHandlers } from "@/lib/tasks/types"

type TaskListViewProps = {
  visibleStatuses: readonly TaskStatus[]
  tasksByStatus: Record<TaskStatus, Task[]>
} & TaskUpdateHandlers

export function TaskListView({
  visibleStatuses,
  tasksByStatus,
  onPriorityChange,
  onStatusChange,
}: TaskListViewProps) {
  return (
    <div className="flex flex-col gap-1">
      {visibleStatuses.map((status) => (
        <TaskStatusSection
          key={status}
          status={status}
          tasks={tasksByStatus[status]}
          onPriorityChange={onPriorityChange}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}
