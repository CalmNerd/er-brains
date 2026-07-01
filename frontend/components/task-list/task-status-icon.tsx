import { HugeiconsIcon } from "@hugeicons/react"

import { STATUS_ICON_CONFIG } from "@/lib/tasks/icon-config"
import type { TaskStatus } from "@/lib/tasks/types"
import { cn } from "@/lib/utils"

type TaskStatusIconProps = {
  status: TaskStatus
  className?: string
}

export function TaskStatusIcon({ status, className }: TaskStatusIconProps) {
  const config = STATUS_ICON_CONFIG[status]

  return (
    <HugeiconsIcon
      icon={config.icon}
      strokeWidth={2}
      className={cn("size-3.5 shrink-0", config.className, className)}
    />
  )
}
