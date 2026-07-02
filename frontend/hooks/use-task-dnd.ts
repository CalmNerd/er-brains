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

import { STATUS_ORDER } from "@/lib/tasks/constants"
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
  tasks: TTask[]
  onUpdateTask: (taskId: TaskId, updates: UpdateTaskInput) => void
}

type UseTaskDndReturn<TTask extends Task = Task> = {
  tasksByStatus: Record<TaskStatus, TTask[]>
  sortableIds: UniqueIdentifier[]
  sensors: ReturnType<typeof useSensors>
  handleDragEnd: (event: DragEndEvent) => void
  updateTaskPriority: TaskPriorityChangeHandler
  updateTaskStatus: TaskStatusChangeHandler
}

function createEmptyGroupedTasks<TTask extends Task>(): Record<TaskStatus, TTask[]> {
  return STATUS_ORDER.reduce<Record<TaskStatus, TTask[]>>(
    (acc, status) => {
      acc[status] = []
      return acc
    },
    {} as Record<TaskStatus, TTask[]>
  )
}

function groupTasksByStatus<TTask extends Task>(
  tasks: TTask[]
): Record<TaskStatus, TTask[]> {
  const grouped = createEmptyGroupedTasks<TTask>()

  for (const task of tasks) {
    grouped[task.status].push(task)
  }

  return grouped
}

/** Manages grouped task display and drag-and-drop against server-backed task data. */
export function useTaskDnd<TTask extends Task = Task>({
  tasks,
  onUpdateTask,
}: UseTaskDndOptions<TTask>): UseTaskDndReturn<TTask> {
  const tasksByStatus = React.useMemo(
    () => groupTasksByStatus(tasks),
    [tasks]
  )

  const sortableIds = React.useMemo<UniqueIdentifier[]>(
    () =>
      STATUS_ORDER.flatMap((status) =>
        tasksByStatus[status].map((task) => task.id)
      ),
    [tasksByStatus]
  )

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 4 } }),
    useSensor(KeyboardSensor, {})
  )

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const activeContainer = findTaskContainer(active.id, tasksByStatus)
      const overContainer = findTaskContainer(over.id, tasksByStatus)

      if (!activeContainer || !overContainer) return

      const activeTask = tasksByStatus[activeContainer].find((task) =>
        isSameTaskId(active.id, task.id)
      )

      if (!activeTask) return

      if (activeContainer !== overContainer) {
        onUpdateTask(activeTask.id, { status: overContainer })
      }
    },
    [onUpdateTask, tasksByStatus]
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
    tasksByStatus,
    sortableIds,
    sensors,
    handleDragEnd,
    updateTaskPriority,
    updateTaskStatus,
  }
}
