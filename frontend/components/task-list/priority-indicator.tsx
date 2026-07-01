import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  MoreHorizontalIcon,
  SignalFull02Icon,
} from "@hugeicons/core-free-icons"

import type { TaskPriority } from "@/lib/tasks/types"
import { cn } from "@/lib/utils"

type PriorityIndicatorProps = {
  priority: TaskPriority
  className?: string
}

const PRIORITY_CONFIG: Record<
  TaskPriority,
  { icon: typeof Alert02Icon; className: string; label: string }
> = {
  High: {
    icon: Alert02Icon,
    className: "text-orange-500",
    label: "High priority",
  },
  Medium: {
    icon: SignalFull02Icon,
    className: "text-muted-foreground",
    label: "Medium priority",
  },
  Low: {
    icon: MoreHorizontalIcon,
    className: "text-muted-foreground/60",
    label: "Low priority",
  },
}

export function PriorityIndicator({ priority, className }: PriorityIndicatorProps) {
  const config = PRIORITY_CONFIG[priority]

  return (
    <span
      className={cn("flex size-4 shrink-0 items-center justify-center", className)}
      title={config.label}
      aria-label={config.label}
    >
      <HugeiconsIcon
        icon={config.icon}
        strokeWidth={2}
        className={cn("size-3.5", config.className)}
      />
    </span>
  )
}
