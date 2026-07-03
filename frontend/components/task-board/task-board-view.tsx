"use client"

import { TaskBoardColumn } from "@/components/task-board/task-board-column"
import type { TaskSortBy } from "@/lib/tasks/constants"
import type { Task, TaskStatus, TaskUpdateHandlers } from "@/lib/tasks/types"

type TaskBoardViewProps = {
  visibleStatuses: readonly TaskStatus[]
  tasksByStatus: Record<TaskStatus, Task[]>
  sortBy: TaskSortBy
  activeDragStatus: TaskStatus | null
  onTaskClick: (task: Task) => void
  onAddTask: (status: TaskStatus) => void
} & TaskUpdateHandlers

export function TaskBoardView({
  visibleStatuses,
  tasksByStatus,
  sortBy,
  activeDragStatus,
  onPriorityChange,
  onStatusChange,
  onTaskClick,
  onAddTask,
}: TaskBoardViewProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {visibleStatuses.map((status) => (
        <TaskBoardColumn
          key={status}
          status={status}
          tasks={tasksByStatus[status]}
          sortBy={sortBy}
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
