"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon } from "@hugeicons/core-free-icons"

import { TaskStatusIcon } from "@/components/task-list/task-status-icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TASK_STATUSES, type TaskStatus } from "@/lib/tasks/types"

type TaskStatusDropdownProps = {
  status: TaskStatus
  onStatusChange: (status: TaskStatus) => void
}

/** Stops drag activation when opening the status menu. */
function stopDragPointerDown(event: React.PointerEvent) {
  event.stopPropagation()
}

export function TaskStatusDropdown({
  status,
  onStatusChange,
}: TaskStatusDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex size-5 shrink-0 items-center justify-center rounded outline-hidden hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        onPointerDown={stopDragPointerDown}
        aria-label="Change status"
      >
        <TaskStatusIcon status={status} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-40">
        {TASK_STATUSES.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onStatusChange(option)}
            className="gap-2"
          >
            <TaskStatusIcon status={option} />
            <span className="flex-1">{option}</span>
            {status === option ? (
              <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3.5" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
