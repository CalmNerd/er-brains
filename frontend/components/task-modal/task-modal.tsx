"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Cancel01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"

import { SuggestionField } from "@/components/task-modal/suggestion-field"
import { TaskModalMetadata } from "@/components/task-modal/task-modal-metadata"
import { useTaskAiSuggestions } from "@/components/task-modal/use-task-ai-suggestions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog"
import {
  buildTaskFormValues,
  canSubmitTaskForm,
  type TaskFormValues,
} from "@/lib/tasks/task-form"
import type { TaskId } from "@/lib/tasks/types"
import { formatTaskId } from "@/lib/tasks/utils"
import { cn } from "@/lib/utils"

type TaskModalProps = {
  open: boolean
  mode: "create" | "edit"
  teamName: string
  initialValues: TaskFormValues
  taskId?: TaskId
  onOpenChange: (open: boolean) => void
  onCreate: (values: TaskFormValues, createMore: boolean) => void
  onUpdate: (taskId: TaskId, values: TaskFormValues) => void
  onDelete?: (taskId: TaskId) => void
}

function CreateMoreToggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Create more tasks"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-4 w-7 shrink-0 rounded-full border border-transparent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute top-1/2 left-0.5 block size-3 rounded-full bg-background shadow-sm transition-transform -translate-y-1/2",
          checked && "translate-x-3"
        )}
      />
    </button>
  )
}

export function TaskModal({
  open,
  mode,
  teamName,
  initialValues,
  taskId,
  onOpenChange,
  onCreate,
  onUpdate,
  onDelete,
}: TaskModalProps) {
  const [values, setValues] = useState<TaskFormValues>(initialValues)
  const [createMore, setCreateMore] = useState(false)
  const [createDefaults, setCreateDefaults] =
    useState<TaskFormValues>(initialValues)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (!open) {
      wasOpenRef.current = false
      return
    }

    if (!wasOpenRef.current) {
      wasOpenRef.current = true
      setValues(initialValues)
      setCreateDefaults(initialValues)
      setCreateMore(false)
    }
  }, [initialValues, open])

  const updateField = useCallback(
    <K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) => {
      setValues((current) => ({ ...current, [key]: value }))
    },
    []
  )

  const aiEnabled = open

  const {
    getDisplayValue,
    getPriorityDisplay,
    fieldStatuses,
    handleFieldChange,
    acceptField,
    rejectField,
    isFieldPending,
    isFieldLoading,
  } = useTaskAiSuggestions({
    enabled: aiEnabled,
    open,
    values,
    onApplyField: updateField,
  })

  const canSubmit = canSubmitTaskForm(mode, values, initialValues)

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return

    if (mode === "create") {
      onCreate(values, createMore)

      if (createMore) {
        setValues(buildTaskFormValues(createDefaults))
        return
      }

      onOpenChange(false)
      return
    }

    if (taskId) {
      onUpdate(taskId, values)
      onOpenChange(false)
    }
  }, [
    canSubmit,
    createDefaults,
    createMore,
    mode,
    onCreate,
    onOpenChange,
    onUpdate,
    taskId,
    values,
  ])

  const handleDelete = useCallback(() => {
    if (!taskId || !onDelete) return

    onDelete(taskId)
    onOpenChange(false)
  }, [onDelete, onOpenChange, taskId])

  const editTaskLabel =
    values.title.trim() || initialValues.title.trim() || "Untitled task"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[min(90vh,48rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b px-5 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden text-xs text-muted-foreground">
            <span className="text-foreground inline-flex shrink-0 items-center gap-1.5 font-medium whitespace-nowrap">
              {teamName}
            </span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-3 shrink-0"
            />
            {mode === "create" ? (
              <span className="shrink-0">New task</span>
            ) : (
              <>
                <span className="shrink-0">Task</span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className="size-3 shrink-0"
                />
                <span className="text-foreground min-w-0 truncate text-xs font-medium">
                  {taskId ? formatTaskId(taskId) : ""} {editTaskLabel}
                </span>
              </>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {mode === "edit" && onDelete ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Delete task"
                className="hover:text-destructive"
                onClick={handleDelete}
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
              </Button>
            ) : null}
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close"
                />
              }
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            </DialogClose>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto px-5 py-4">
          <SuggestionField
            value={getDisplayValue("title")}
            onChange={(title) => handleFieldChange("title", title)}
            placeholder="Task title"
            autoFocus={mode === "create"}
            multiline
            inputClassName="text-2xl font-medium text-foreground"
            isPending={isFieldPending("title")}
            isLoading={isFieldLoading("title")}
            onAccept={() => acceptField("title")}
            onReject={() => rejectField("title")}
          />

          <SuggestionField
            value={getDisplayValue("description")}
            onChange={(description) =>
              handleFieldChange("description", description)
            }
            placeholder="Add description..."
            multiline
            inputClassName="text-sm leading-relaxed text-muted-foreground"
            isPending={isFieldPending("description")}
            isLoading={isFieldLoading("description")}
            onAccept={() => acceptField("description")}
            onReject={() => rejectField("description")}
          />

          <TaskModalMetadata
            values={values}
            onChange={updateField}
            priorityDisplay={getPriorityDisplay()}
            prioritySuggestionStatus={fieldStatuses.priority}
            onAcceptPriority={() => acceptField("priority")}
            onRejectPriority={() => rejectField("priority")}
          />
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 border-t px-5 py-4">
          {mode === "create" ? (
            <label className="flex cursor-pointer items-center gap-2">
              <CreateMoreToggle
                checked={createMore}
                onCheckedChange={setCreateMore}
              />
              <span className="text-xs text-muted-foreground">Create more</span>
            </label>
          ) : (
            <div />
          )}

          <Button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="min-w-28"
          >
            {mode === "create" ? "Create task" : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
