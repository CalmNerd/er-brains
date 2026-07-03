import { getOrderByColumnLabel, type TaskOrderBy } from "@/lib/tasks/constants"
import { cn } from "@/lib/utils"

type TaskOrderedDragBlockerProps = {
  orderBy: TaskOrderBy
  visible: boolean
  className?: string
}

/** Section overlay shown while reordering within a sorted status bucket. */
export function TaskOrderedDragBlocker({
  orderBy,
  visible,
  className,
}: TaskOrderedDragBlockerProps) {
  const label = getOrderByColumnLabel(orderBy)

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
