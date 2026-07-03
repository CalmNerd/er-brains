"use client"

import { TaskStatusSection } from "@/components/task-list/task-status-section"
import type { TaskOrderBy } from "@/lib/tasks/constants"
import type { Task, TaskStatus, TaskUpdateHandlers } from "@/lib/tasks/types"

type TaskListViewProps = {
  visibleStatuses: readonly TaskStatus[]
  tasksByStatus: Record<TaskStatus, Task[]>
  orderBy: TaskOrderBy
  activeDragStatus: TaskStatus | null
  onTaskClick: (task: Task) => void
  onAddTask: (status: TaskStatus) => void
} & TaskUpdateHandlers

export function TaskListView({
  visibleStatuses,
  tasksByStatus,
  orderBy,
  activeDragStatus,
  onPriorityChange,
  onStatusChange,
  onTaskClick,
  onAddTask,
}: TaskListViewProps) {
  return (
    <div className="flex flex-col gap-1">
      {visibleStatuses.map((status) => (
        <TaskStatusSection
          key={status}
          status={status}
          tasks={tasksByStatus[status]}
          orderBy={orderBy}
          activeDragStatus={activeDragStatus}
          onPriorityChange={onPriorityChange}
          onStatusChange={onStatusChange}
          onTaskClick={onTaskClick}
          onAddTask={onAddTask}
        />
      ))}
    </div>
  )
}
