"use client"

import * as React from "react"

import {
  buildTaskFormValues,
  CLOSED_TASK_MODAL_STATE,
  taskToFormValues,
  type OpenTaskModalState,
  type TaskFormValues,
} from "@/lib/tasks/task-form"
import type { Task, TaskStatus } from "@/lib/tasks/types"

export function useTaskModal() {
  const [state, setState] = React.useState<OpenTaskModalState>(
    CLOSED_TASK_MODAL_STATE
  )

  const openCreateModal = React.useCallback(
    (defaults?: Partial<TaskFormValues>) => {
      setState({
        open: true,
        mode: "create",
        initialValues: buildTaskFormValues(defaults),
      })
    },
    []
  )

  const openCreateModalForStatus = React.useCallback((status: TaskStatus) => {
    openCreateModal({ status })
  }, [openCreateModal])

  const openEditModal = React.useCallback((task: Task) => {
    setState({
      open: true,
      mode: "edit",
      taskId: task.id,
      initialValues: taskToFormValues(task),
    })
  }, [])

  const closeModal = React.useCallback(() => {
    setState(CLOSED_TASK_MODAL_STATE)
  }, [])

  return {
    modalState: state,
    openCreateModal,
    openCreateModalForStatus,
    openEditModal,
    closeModal,
  }
}
