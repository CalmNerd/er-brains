"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  FilterIcon,
  KanbanIcon,
  Menu07Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DEFAULT_TASK_FILTERS,
  isManualSortBy,
  TASK_LAYOUT_OPTIONS,
  TASK_ORDERING_OPTIONS,
  TASK_SORT_BY_OPTIONS,
  type TaskLayout,
  type TaskOrdering,
  type TaskSortBy,
  type TaskView,
} from "@/lib/tasks/constants"
import { cn } from "@/lib/utils"

export type TaskFilters = {
  view: TaskView
  layout: TaskLayout
  sortBy: TaskSortBy
  ordering: TaskOrdering
}

type TaskFilterMenuProps = {
  filters: TaskFilters
  onLayoutChange: (layout: TaskLayout) => void
  onSortByChange: (sortBy: TaskSortBy) => void
  onOrderingChange: (ordering: TaskOrdering) => void
  onReset: () => void
}

const LAYOUT_ICONS = {
  list: Menu07Icon,
  board: KanbanIcon,
} as const

/** Prevents the parent dropdown from closing when interacting with nested selects. */
function stopMenuClose(event: React.PointerEvent) {
  event.stopPropagation()
}

export function TaskFilterMenu({
  filters,
  onLayoutChange,
  onSortByChange,
  onOrderingChange,
  onReset,
}: TaskFilterMenuProps) {
  const isDirty =
    filters.view !== DEFAULT_TASK_FILTERS.view ||
    filters.layout !== DEFAULT_TASK_FILTERS.layout ||
    filters.sortBy !== DEFAULT_TASK_FILTERS.sortBy ||
    filters.ordering !== DEFAULT_TASK_FILTERS.ordering

  const isOrderingEnabled = !isManualSortBy(filters.sortBy)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            className="relative"
            aria-label={isDirty ? "View options (filters active)" : "View options"}
          />
        }
      >
        <HugeiconsIcon icon={FilterIcon} strokeWidth={2} />
        {isDirty ? (
          <span
            className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-blue-500"
            aria-hidden
          />
        ) : null}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2">
          <div className="flex gap-1">
            {TASK_LAYOUT_OPTIONS.map((option) => {
              const Icon = LAYOUT_ICONS[option.value]
              const isActive = filters.layout === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onLayoutChange(option.value)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 border border-border/40 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <HugeiconsIcon icon={Icon} strokeWidth={2} className="size-3.5" />
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 p-2">
          <Label className="text-xs font-normal text-muted-foreground">
            Sort by
          </Label>
          <div onPointerDown={stopMenuClose}>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => onSortByChange(value as TaskSortBy)}
              items={TASK_SORT_BY_OPTIONS}
            >
              <SelectTrigger size="sm" className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  {TASK_SORT_BY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 p-2">
          <Label className="text-xs font-normal text-muted-foreground">
            Ordering
          </Label>
          <div onPointerDown={stopMenuClose}>
            <Select
              value={filters.ordering}
              onValueChange={(value) =>
                onOrderingChange(value as TaskOrdering)
              }
              items={TASK_ORDERING_OPTIONS}
              disabled={!isOrderingEnabled}
            >
              <SelectTrigger
                size="sm"
                className="w-[120px]"
                disabled={!isOrderingEnabled}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  {TASK_ORDERING_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground"
            onClick={onReset}
            disabled={!isDirty}
          >
            Reset
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
