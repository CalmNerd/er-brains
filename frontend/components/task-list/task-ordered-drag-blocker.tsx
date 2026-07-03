import { getSortByColumnLabel, type TaskSortBy } from "@/lib/tasks/constants"
import { cn } from "@/lib/utils"

type TaskOrderedDragBlockerProps = {
  sortBy: TaskSortBy
  visible: boolean
  className?: string
}

/** Section overlay shown while reordering within a sorted status bucket. */
export function TaskOrderedDragBlocker({
  sortBy,
  visible,
  className,
}: TaskOrderedDragBlockerProps) {
  const label = getSortByColumnLabel(sortBy)

  if (!visible || !label) {
    return null
  }

  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex items-center justify-center rounded-lg border border-dashed border-border/60 bg-background/80 p-4 backdrop-blur-[1px]",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <p className="text-center text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
