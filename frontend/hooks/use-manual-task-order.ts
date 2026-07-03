"use client"

import * as React from "react"

import type { Task, TaskId, TaskStatus } from "@/lib/tasks/types"
import {
  areManualOrdersEqual,
  buildManualOrderFromTasks,
  getTasksOrderSignature,
  moveTaskInManualOrder,
  reorderManualOrder,
  syncManualOrder,
} from "@/lib/tasks/utils"

type UseManualTaskOrderOptions = {
  teamId: number | null
  tasks: Task[]
}

type UseManualTaskOrderReturn = {
  manualOrder: Record<TaskStatus, TaskId[]>
  reorderWithinStatus: (
    status: TaskStatus,
    fromIndex: number,
    toIndex: number
  ) => void
  moveAcrossStatus: (
    taskId: TaskId,
    fromStatus: TaskStatus,
    toStatus: TaskStatus,
    toIndex: number
  ) => void
}

/** Tracks per-team manual task order for drag-and-drop when ordering by status. */
export function useManualTaskOrder({
  teamId,
  tasks,
}: UseManualTaskOrderOptions): UseManualTaskOrderReturn {
  const [manualOrder, setManualOrder] = React.useState<
    Record<TaskStatus, TaskId[]>
  >(() => buildManualOrderFromTasks(tasks))

  const previousTeamIdRef = React.useRef(teamId)
  const taskOrderSignature = React.useMemo(
    () => getTasksOrderSignature(tasks),
    [tasks]
  )

  React.useEffect(() => {
    if (previousTeamIdRef.current !== teamId) {
      previousTeamIdRef.current = teamId
      setManualOrder(buildManualOrderFromTasks(tasks))
      return
    }

    setManualOrder((current) => {
      const next = syncManualOrder(current, tasks)
      return areManualOrdersEqual(current, next) ? current : next
    })
  }, [teamId, taskOrderSignature])

  const reorderWithinStatus = React.useCallback(
    (status: TaskStatus, fromIndex: number, toIndex: number) => {
      setManualOrder((current) =>
        reorderManualOrder(current, status, fromIndex, toIndex)
      )
    },
    []
  )

  const moveAcrossStatus = React.useCallback(
    (
      taskId: TaskId,
      fromStatus: TaskStatus,
      toStatus: TaskStatus,
      toIndex: number
    ) => {
      setManualOrder((current) =>
        moveTaskInManualOrder(current, taskId, fromStatus, toStatus, toIndex)
      )
    },
    []
  )

  return {
    manualOrder,
    reorderWithinStatus,
    moveAcrossStatus,
  }
}
