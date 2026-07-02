"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon } from "@hugeicons/core-free-icons"

import { TaskFilterMenu, type TaskFilters } from "@/components/task-list/task-filter-menu"
import { Button } from "@/components/ui/button"
import type { TaskLayout, TaskOrderBy, TaskView } from "@/lib/tasks/constants"
import { cn } from "@/lib/utils"

type TaskListToolbarProps = {
  filters: TaskFilters
  onViewChange: (view: TaskView) => void
  onLayoutChange: (layout: TaskLayout) => void
  onOrderByChange: (orderBy: TaskOrderBy) => void
  onResetFilters: () => void
  onCreateTask: () => void
}

const VIEW_OPTIONS: { value: TaskView; label: string }[] = [
  { value: "all", label: "All tasks" },
  { value: "active", label: "Active tasks" },
]

export function TaskListToolbar({
  filters,
  onViewChange,
  onLayoutChange,
  onOrderByChange,
  onResetFilters,
  onCreateTask,
}: TaskListToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-1 py-2">
        {VIEW_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onViewChange(option.value)}
            className={cn(
              "rounded-full border border-border/40 px-3 py-1.5 text-xs font-medium transition-colors",
              filters.view === option.value
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 py-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Create task"
          onClick={onCreateTask}
        >
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
        </Button>

        <TaskFilterMenu
          filters={filters}
          onLayoutChange={onLayoutChange}
          onOrderByChange={onOrderByChange}
          onReset={onResetFilters}
        />
      </div>
    </div>
  )
}
