"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { TaskDueDate } from "@/components/task-list/task-due-date"
import { TaskPriorityDropdown } from "@/components/task-list/task-priority-dropdown"
import { TaskStatusDropdown } from "@/components/task-list/task-status-dropdown"
import { formatTaskId } from "@/lib/tasks/utils"
import type { Task, TaskUpdateHandlers } from "@/lib/tasks/types"
import { cn } from "@/lib/utils"

type TaskRowProps = {
  task: Task
  onTaskClick: (task: Task) => void
} & TaskUpdateHandlers

/** Prevents the row drag handler from starting when opening task details. */
function stopDragPointerDown(event: React.PointerEvent) {
  event.stopPropagation()
}

export function TaskRow({
  task,
  onPriorityChange,
  onStatusChange,
  onTaskClick,
}: TaskRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      data-dragging={isDragging}
      className={cn(
        "group/row flex h-9 cursor-default items-center gap-2 rounded-md p-2 active:cursor-grabbing",
        "hover:bg-muted/50",
        "data-[dragging=true]:z-10 data-[dragging=true]:bg-muted data-[dragging=true]:opacity-90 data-[dragging=true]:shadow-sm"
      )}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (isDragging) return
        onTaskClick(task)
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return

        event.preventDefault()
        onTaskClick(task)
      }}
    >
      <div
        className="flex shrink-0 items-center gap-2"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={stopDragPointerDown}
      >
        <TaskPriorityDropdown
          priority={task.priority}
          onPriorityChange={(priority) => onPriorityChange(task.id, priority)}
        />

        <TaskStatusDropdown
          status={task.status}
          onStatusChange={(status) => onStatusChange(task.id, status)}
        />
      </div>

      <span className="w-14 shrink-0 text-xs text-muted-foreground">
        {formatTaskId(task.id)}
      </span>

      <p className="min-w-0 flex-1 truncate text-sm text-foreground">
        {task.title}
      </p>

      <TaskDueDate task={task} className="ml-auto shrink-0" />
    </div>
  )
}
