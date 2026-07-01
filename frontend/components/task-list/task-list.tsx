"use client"

import {
  DndContext,
  closestCorners,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import * as React from "react"

import { TaskListToolbar } from "@/components/task-list/task-list-toolbar"
import { TaskStatusSection } from "@/components/task-list/task-status-section"
import { PriorityIndicator } from "@/components/task-list/priority-indicator"
import { TaskStatusIcon } from "@/components/task-list/task-status-icon"
import { useTaskDnd } from "@/hooks/use-task-dnd"
import { ACTIVE_STATUSES, STATUS_ORDER, type TaskView } from "@/lib/tasks/constants"
import { findTaskById, formatDueDate, formatTaskId } from "@/lib/tasks/utils"
import type { Task, TaskStatus } from "@/lib/tasks/types"

type TaskListProps = {
  data: Task[]
}

type DragOverlayRowProps = {
  task: Task
}

function DragOverlayRow({ task }: DragOverlayRowProps) {
  return (
    <div className="flex h-9 cursor-grabbing items-center gap-2 rounded-md border bg-background px-3 shadow-md">
      <PriorityIndicator priority={task.priority} />
      <span className="w-14 shrink-0 text-xs text-muted-foreground">
        {formatTaskId(task.id)}
      </span>
      <TaskStatusIcon status={task.status} />
      <span className="min-w-0 flex-1 truncate text-sm">{task.title}</span>
      <span className="shrink-0 text-xs text-muted-foreground">
        {formatDueDate(task.dueDate)}
      </span>
    </div>
  )
}

export function TaskList({ data }: TaskListProps) {
  const sortableId = React.useId()
  const [view, setView] = React.useState<TaskView>("all")
  const {
    tasksByStatus,
    sortableIds,
    sensors,
    handleDragEnd,
    updateTaskPriority,
    updateTaskStatus,
  } = useTaskDnd({ initialTasks: data })
  const [activeTask, setActiveTask] = React.useState<Task | null>(null)

  const visibleStatuses = React.useMemo<readonly TaskStatus[]>(
    () => (view === "active" ? ACTIVE_STATUSES : STATUS_ORDER),
    [view]
  )

  const handleDragStart = React.useCallback(
    (event: DragStartEvent) => {
      const task = findTaskById(Number(event.active.id), tasksByStatus)
      setActiveTask(task ?? null)
    },
    [tasksByStatus]
  )

  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      handleDragEnd(event)
      setActiveTask(null)
    },
    [handleDragEnd]
  )

  return (
    <div className="flex w-full flex-col px-4 lg:px-6">
      <TaskListToolbar view={view} onViewChange={setView} />

      <DndContext
        id={sortableId}
        sensors={sensors}
        collisionDetection={closestCorners}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
        <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1">
            {visibleStatuses.map((status) => (
              <TaskStatusSection
                key={status}
                status={status}
                tasks={tasksByStatus[status]}
                onPriorityChange={updateTaskPriority}
                onStatusChange={updateTaskStatus}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {activeTask ? <DragOverlayRow task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
