"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  MoreHorizontalIcon,
  SignalFull02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

import { PriorityIndicator } from "@/components/task-list/priority-indicator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TASK_PRIORITIES, type TaskPriority } from "@/lib/tasks/types"
import { cn } from "@/lib/utils"

type TaskPriorityDropdownProps = {
  priority: TaskPriority
  onPriorityChange: (priority: TaskPriority) => void
}

const PRIORITY_ICONS = {
  High: Alert02Icon,
  Medium: SignalFull02Icon,
  Low: MoreHorizontalIcon,
} as const

/** Stops drag activation when opening the priority menu. */
function stopDragPointerDown(event: React.PointerEvent) {
  event.stopPropagation()
}

export function TaskPriorityDropdown({
  priority,
  onPriorityChange,
}: TaskPriorityDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex size-5 shrink-0 items-center justify-center rounded outline-hidden hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        onPointerDown={stopDragPointerDown}
        aria-label="Change priority"
      >
        <PriorityIndicator priority={priority} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-36">
        {TASK_PRIORITIES.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onPriorityChange(option)}
            className="gap-2"
          >
            <HugeiconsIcon
              icon={PRIORITY_ICONS[option]}
              strokeWidth={2}
              className={cn(
                "size-3.5",
                option === "High" ? "text-orange-500" : "text-muted-foreground"
              )}
            />
            <span className="flex-1">{option}</span>
            {priority === option ? (
              <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3.5" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
