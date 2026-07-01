import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  CircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"

import type { TaskStatus } from "@/lib/tasks/types"
import { cn } from "@/lib/utils"

type TaskStatusIconProps = {
  status: TaskStatus
  className?: string
}

const STATUS_ICONS = {
  "To Do": CircleIcon,
  "In Progress": Loading03Icon,
  Done: CheckmarkCircle01Icon,
} as const

const STATUS_ICON_CLASS: Record<TaskStatus, string> = {
  "To Do": "text-muted-foreground",
  "In Progress": "text-amber-500",
  Done: "text-blue-500",
}

export function TaskStatusIcon({ status, className }: TaskStatusIconProps) {
  return (
    <HugeiconsIcon
      icon={STATUS_ICONS[status]}
      strokeWidth={2}
      className={cn("size-3.5 shrink-0", STATUS_ICON_CLASS[status], className)}
    />
  )
}
