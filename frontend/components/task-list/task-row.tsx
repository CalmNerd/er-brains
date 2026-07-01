"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { TaskDetailDialog } from "@/components/task-list/task-detail-dialog"
import { TaskPriorityDropdown } from "@/components/task-list/task-priority-dropdown"
import { TaskStatusDropdown } from "@/components/task-list/task-status-dropdown"
import { formatDueDate, formatTaskId } from "@/lib/tasks/utils"
import type { Task, TaskUpdateHandlers } from "@/lib/tasks/types"
import { cn } from "@/lib/utils"

type TaskRowProps = {
  task: Task
} & TaskUpdateHandlers

export function TaskRow({
  task,
  onPriorityChange,
  onStatusChange,
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
        "group/row flex h-9 cursor-grab items-center gap-2 rounded-md p-2 active:cursor-grabbing",
        "hover:bg-muted/50",
        "data-[dragging=true]:z-10 data-[dragging=true]:bg-muted data-[dragging=true]:opacity-90 data-[dragging=true]:shadow-sm"
      )}
      {...attributes}
      {...listeners}
    >
      <TaskPriorityDropdown
        priority={task.priority}
        onPriorityChange={(priority) => onPriorityChange(task.id, priority)}
      />

      <span className="w-14 shrink-0 text-xs text-muted-foreground">
        {formatTaskId(task.id)}
      </span>

      <TaskStatusDropdown
        status={task.status}
        onStatusChange={(status) => onStatusChange(task.id, status)}
      />

      <TaskDetailDialog task={task} />

      <span className="ml-auto shrink-0 text-xs text-muted-foreground">
        {formatDueDate(task.dueDate)}
      </span>
    </div>
  )
}
