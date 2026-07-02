import type { CreateTaskInput, Task, TaskId } from "@/lib/tasks/types"

export type TaskFormValues = {
  title: string
  description: string
  status: CreateTaskInput["status"]
  priority: CreateTaskInput["priority"]
  dueDate: string
}

export const DEFAULT_TASK_FORM_VALUES: TaskFormValues = {
  title: "",
  description: "",
  status: "To Do",
  priority: "Low",
  dueDate: new Date().toISOString().slice(0, 10),
}

export const TOOLBAR_CREATE_DEFAULTS: Partial<TaskFormValues> = {
  status: "To Do",
  priority: "Low",
}

export function buildTaskFormValues(
  overrides?: Partial<TaskFormValues>
): TaskFormValues {
  return {
    ...DEFAULT_TASK_FORM_VALUES,
    ...overrides,
  }
}

export function taskToFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
  }
}

export function formValuesToCreateInput(
  values: TaskFormValues
): CreateTaskInput {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    status: values.status,
    priority: values.priority,
    dueDate: values.dueDate,
  }
}

export function isTaskFormDirty(
  current: TaskFormValues,
  baseline: TaskFormValues
): boolean {
  return (
    current.title !== baseline.title ||
    current.description !== baseline.description ||
    current.status !== baseline.status ||
    current.priority !== baseline.priority ||
    current.dueDate !== baseline.dueDate
  )
}

export function canSubmitTaskForm(
  mode: "create" | "edit",
  values: TaskFormValues,
  baseline: TaskFormValues
): boolean {
  if (!values.title.trim()) {
    return false
  }

  if (mode === "edit") {
    return isTaskFormDirty(values, baseline)
  }

  return true
}

export type OpenTaskModalState =
  | { open: false }
  | {
      open: true
      mode: "create"
      initialValues: TaskFormValues
    }
  | {
      open: true
      mode: "edit"
      taskId: TaskId
      initialValues: TaskFormValues
    }

export const CLOSED_TASK_MODAL_STATE: OpenTaskModalState = { open: false }
