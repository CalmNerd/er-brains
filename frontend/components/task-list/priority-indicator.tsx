import { HugeiconsIcon } from "@hugeicons/react"

import { PRIORITY_ICON_CONFIG } from "@/lib/tasks/icon-config"
import type { TaskPriority } from "@/lib/tasks/types"
import { cn } from "@/lib/utils"

type PriorityIndicatorProps = {
  priority: TaskPriority
  className?: string
}

export function PriorityIndicator({ priority, className }: PriorityIndicatorProps) {
  const config = PRIORITY_ICON_CONFIG[priority]

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
