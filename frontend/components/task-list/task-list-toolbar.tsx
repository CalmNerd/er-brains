"use client"

import { TaskFilterMenu, type TaskFilters } from "@/components/task-list/task-filter-menu"
import type { TaskLayout, TaskOrderBy, TaskView } from "@/lib/tasks/constants"
import { cn } from "@/lib/utils"

type TaskListToolbarProps = {
  filters: TaskFilters
  onViewChange: (view: TaskView) => void
  onLayoutChange: (layout: TaskLayout) => void
  onOrderByChange: (orderBy: TaskOrderBy) => void
  onResetFilters: () => void
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

      <TaskFilterMenu
        filters={filters}
        onLayoutChange={onLayoutChange}
        onOrderByChange={onOrderByChange}
        onReset={onResetFilters}
      />
    </div>
  )
}
