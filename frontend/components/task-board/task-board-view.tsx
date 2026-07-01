"use client"

import { TaskBoardColumn } from "@/components/task-board/task-board-column"
import type { Task, TaskStatus, TaskUpdateHandlers } from "@/lib/tasks/types"

type TaskBoardViewProps = {
  visibleStatuses: readonly TaskStatus[]
  tasksByStatus: Record<TaskStatus, Task[]>
} & TaskUpdateHandlers

export function TaskBoardView({
  visibleStatuses,
  tasksByStatus,
  onPriorityChange,
  onStatusChange,
}: TaskBoardViewProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {visibleStatuses.map((status) => (
        <TaskBoardColumn
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