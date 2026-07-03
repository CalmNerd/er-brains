"use client"

import * as React from "react"
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"

import { STATUS_ORDER, isManualSortBy } from "@/lib/tasks/constants"
import type { TaskSortBy } from "@/lib/tasks/constants"
import { isSameTaskId } from "@/lib/tasks/types"
import { findTaskContainer } from "@/lib/tasks/utils"
import type {
  Task,
  TaskId,
  TaskPriorityChangeHandler,
  TaskStatus,
  TaskStatusChangeHandler,
  UpdateTaskInput,
} from "@/lib/tasks/types"

type UseTaskDndOptions<TTask extends Task = Task> = {
  displayedTasksByStatus: Record<TaskStatus, TTask[]>
  sortBy: TaskSortBy
  onUpdateTask: (taskId: TaskId, updates: UpdateTaskInput) => void
  onReorderWithinStatus: (
    status: TaskStatus,
    fromIndex: number,
    toIndex: number
  ) => void
  onMoveAcrossStatus: (
    taskId: TaskId,
    fromStatus: TaskStatus,
    toStatus: TaskStatus,
    toIndex: number
  ) => void
}

type UseTaskDndReturn = {
  sortableIds: UniqueIdentifier[]
  sensors: ReturnType<typeof useSensors>
  handleDragEnd: (event: DragEndEvent) => void
  updateTaskPriority: TaskPriorityChangeHandler
  updateTaskStatus: TaskStatusChangeHandler
}

function resolveInsertIndex<TTask extends Task>(
  overId: string | number,
  containerTasks: TTask[]
): number {
  const overIndex = containerTasks.findIndex((task) =>
    isSameTaskId(overId, task.id)
  )

  if (overIndex !== -1) {
    return overIndex
  }

  return containerTasks.length
}

/** Manages drag-and-drop using the currently displayed task order. */
export function useTaskDnd<TTask extends Task = Task>({
  displayedTasksByStatus,
  sortBy,
  onUpdateTask,
  onReorderWithinStatus,
  onMoveAcrossStatus,
}: UseTaskDndOptions<TTask>): UseTaskDndReturn {
  const sortableIds = React.useMemo<UniqueIdentifier[]>(
    () =>
      STATUS_ORDER.flatMap((status) =>
        displayedTasksByStatus[status].map((task) => task.id)
      ),
    [displayedTasksByStatus]
  )

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 4 } }),
    useSensor(KeyboardSensor, {})
  )

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over) return

      const activeContainer = findTaskContainer(active.id, displayedTasksByStatus)
      const overContainer = findTaskContainer(over.id, displayedTasksByStatus)

      if (!activeContainer || !overContainer) return

      const activeTask = displayedTasksByStatus[activeContainer].find((task) =>
        isSameTaskId(active.id, task.id)
      )

      if (!activeTask) return

      if (activeContainer === overContainer) {
        if (!isManualSortBy(sortBy)) {
          return
        }

        if (active.id === over.id) return

        const activeIndex = displayedTasksByStatus[activeContainer].findIndex(
          (task) => isSameTaskId(active.id, task.id)
        )
        const overIndex = displayedTasksByStatus[activeContainer].findIndex(
          (task) => isSameTaskId(over.id, task.id)
        )

        if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
          return
        }

        onReorderWithinStatus(activeContainer, activeIndex, overIndex)
        return
      }

      const targetTasks = displayedTasksByStatus[overContainer]
      const insertIndex = resolveInsertIndex(over.id, targetTasks)

      onMoveAcrossStatus(
        activeTask.id,
        activeContainer,
        overContainer,
        insertIndex
      )
      onUpdateTask(activeTask.id, { status: overContainer })
    },
    [
      displayedTasksByStatus,
      sortBy,
      onMoveAcrossStatus,
      onReorderWithinStatus,
      onUpdateTask,
    ]
  )

  const updateTaskPriority = React.useCallback<TaskPriorityChangeHandler>(
    (taskId, priority) => {
      onUpdateTask(taskId, { priority })
    },
    [onUpdateTask]
  )

  const updateTaskStatus = React.useCallback<TaskStatusChangeHandler>(
    (taskId, status) => {
      onUpdateTask(taskId, { status })
    },
    [onUpdateTask]
  )

  return {
    sortableIds,
    sensors,
    handleDragEnd,
    updateTaskPriority,
    updateTaskStatus,
  }
}
