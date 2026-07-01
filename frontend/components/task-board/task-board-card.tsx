"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { HugeiconsIcon } from "@hugeicons/react"
import { Time04Icon } from "@hugeicons/core-free-icons"

import { TaskDetailDialog } from "@/components/task-list/task-detail-dialog"
import { TaskPriorityDropdown } from "@/components/task-list/task-priority-dropdown"
import { TaskStatusDropdown } from "@/components/task-list/task-status-dropdown"
import { formatDueDate } from "@/lib/tasks/utils"
import type { Task, TaskUpdateHandlers } from "@/lib/tasks/types"
import { cn } from "@/lib/utils"

type TaskBoardCardProps = {
  task: Task
} & TaskUpdateHandlers

export function TaskBoardCard({
  task,
  onPriorityChange,
  onStatusChange,
}: TaskBoardCardProps) {
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
        "group/card cursor-grab rounded-lg border bg-card p-3 active:cursor-grabbing",
        "hover:border-border/80",
        "data-[dragging=true]:z-10 data-[dragging=true]:opacity-90 data-[dragging=true]:shadow-md"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="mb-2 min-w-0">
        <TaskDetailDialog task={task} triggerVariant="board" />
      </div>

      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {task.description}
      </p>

      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 text-xs text-muted-foreground">
          <HugeiconsIcon
            icon={Time04Icon}
            strokeWidth={2}
            className="size-3.5 shrink-0"
          />
          <span className="truncate">{formatDueDate(task.dueDate)}</span>
        </div>

        <TaskPriorityDropdown
          priority={task.priority}
          onPriorityChange={(priority) => onPriorityChange(task.id, priority)}
        />

        <TaskStatusDropdown
          status={task.status}
          onStatusChange={(status) => onStatusChange(task.id, status)}
        />
      </div>
    </div>
  )
}
