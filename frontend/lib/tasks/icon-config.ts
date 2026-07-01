import {
  AlertSquareIcon,
  CheckmarkCircle02Icon,
  CircleIcon,
  FullSignalIcon,
  LowSignalIcon,
  MediumSignalIcon,
  Progress03Icon,
} from "@hugeicons/core-free-icons"

import type { TaskPriority, TaskStatus } from "@/lib/tasks/types"

type IconDefinition = {
  icon: typeof CircleIcon
  className: string
  label: string
}

/** Single source of truth for task status icons and colors. */
export const STATUS_ICON_CONFIG: Record<TaskStatus, IconDefinition> = {
  "To Do": {
    icon: CircleIcon,
    className: "text-muted-foreground",
    label: "To Do",
  },
  "In Progress": {
    icon: Progress03Icon,
    className: "text-yellow-500",
    label: "In Progress",
  },
  Done: {
    icon: CheckmarkCircle02Icon,
    className: "text-blue-500",
    label: "Done",
  },
}

/** Single source of truth for task priority icons and colors. */
export const PRIORITY_ICON_CONFIG: Record<TaskPriority, IconDefinition> = {
  Urgent: {
    icon: AlertSquareIcon,
    className: "text-rose-500",
    label: "Urgent priority",
  },
  High: {
    icon: FullSignalIcon,
    className: "text-orange-500",
    label: "High priority",
  },
  Medium: {
    icon: MediumSignalIcon,
    className: "text-blue-500",
    label: "Medium priority",
  },
  Low: {
    icon: LowSignalIcon,
    className: "text-muted-foreground",
    label: "Low priority",
  },
}
