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
  TaskPriorityChangeHandler,
  TaskStatus,
  TaskStatusChangeHandler,
} from "@/lib/tasks/types"

type UseTaskDndOptions<TTask extends Task = Task> = {
  initialTasks: TTask[]
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

function groupInitialTasks<TTask extends Task>(
  initialTasks: TTask[]
): Record<TaskStatus, TTask[]> {
  const grouped = createEmptyGroupedTasks<TTask>()
  for (const task of initialTasks) {
    grouped[task.status].push(task)
  }
  return grouped
}

/** Manages grouped task state, drag-and-drop, and inline field updates. */
export function useTaskDnd<TTask extends Task = Task>({
  initialTasks,
}: UseTaskDndOptions<TTask>): UseTaskDndReturn<TTask> {
  const [tasksByStatus, setTasksByStatus] = React.useState<
    Record<TaskStatus, TTask[]>
  >(() => groupInitialTasks(initialTasks))

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

  const handleDragEnd = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setTasksByStatus((prev) => {
      const activeContainer = findTaskContainer(active.id, prev)
      const overContainer = findTaskContainer(over.id, prev)
      if (!activeContainer || !overContainer) return prev

      const activeItems = [...prev[activeContainer]]
      const activeIndex = activeItems.findIndex((task) =>
        isSameTaskId(active.id, task.id)
      )
      if (activeIndex === -1) return prev

      const [movedTask] = activeItems.splice(activeIndex, 1)

      if (activeContainer === overContainer) {
        const overIndex = activeItems.findIndex((task) =>
          isSameTaskId(over.id, task.id)
        )
        const insertIndex = overIndex === -1 ? activeItems.length : overIndex
        activeItems.splice(insertIndex, 0, movedTask)

        return { ...prev, [activeContainer]: activeItems }
      }

      const overItems = [...prev[overContainer]]
      const overIndex = overItems.findIndex((task) =>
        isSameTaskId(over.id, task.id)
      )
      const insertIndex = overIndex === -1 ? overItems.length : overIndex
      overItems.splice(insertIndex, 0, {
        ...movedTask,
        status: overContainer,
      } as TTask)

      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      }
    })
  }, [])

  const updateTaskPriority = React.useCallback<TaskPriorityChangeHandler>(
    (taskId, priority) => {
      setTasksByStatus((prev) => {
        const next = { ...prev }

        for (const status of STATUS_ORDER) {
          const index = next[status].findIndex((task) => task.id === taskId)
          if (index === -1) continue

          const tasks = [...next[status]]
          tasks[index] = { ...tasks[index], priority }
          next[status] = tasks
          return next
        }

        return prev
      })
    },
    []
  )

  const updateTaskStatus = React.useCallback<TaskStatusChangeHandler>(
    (taskId, status) => {
      setTasksByStatus((prev) => {
        for (const currentStatus of STATUS_ORDER) {
          const index = prev[currentStatus].findIndex(
            (item) => item.id === taskId
          )
          if (index === -1) continue

          const task = prev[currentStatus][index]
          if (task.status === status) return prev

          return {
            ...prev,
            [currentStatus]: prev[currentStatus].filter(
              (item) => item.id !== taskId
            ),
            [status]: [...prev[status], { ...task, status } as TTask],
          }
        }

        return prev
      })
    },
    []
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
