"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { FilterIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import type { TaskView } from "@/lib/tasks/constants"
import { cn } from "@/lib/utils"

type TaskListToolbarProps = {
  view: TaskView
  onViewChange: (view: TaskView) => void
}

const VIEW_OPTIONS: { value: TaskView; label: string }[] = [
  { value: "all", label: "All tasks" },
  { value: "active", label: "Active tasks" },
]

export function TaskListToolbar({ view, onViewChange }: TaskListToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-1 py-2">
        {VIEW_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onViewChange(option.value)}
            className={cn(
              "rounded-full px-3 py-1.5 border border-border/40 text-xs font-medium transition-colors",
              view === option.value
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <Button variant="outline" size="icon-sm" aria-label="Filter tasks">
        <HugeiconsIcon icon={FilterIcon} strokeWidth={2} />
      </Button>
    </div>
  )
}
