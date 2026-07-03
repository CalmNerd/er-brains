import { formatDueDate, isTaskDueDateOverdue } from "@/lib/tasks/utils"
import type { Task } from "@/lib/tasks/types"
import { cn } from "@/lib/utils"

type TaskDueDateProps = {
  task: Task
  className?: string
}

export function TaskDueDate({ task, className }: TaskDueDateProps) {
  const isOverdue = isTaskDueDateOverdue(task)

  return (
    <span
      className={cn(
        "text-xs text-muted-foreground",
        isOverdue && "text-rose-500",
        className
      )}
    >
      {formatDueDate(task.dueDate)}
    </span>
  )
}
