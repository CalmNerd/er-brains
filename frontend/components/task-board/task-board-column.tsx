"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon } from "@hugeicons/core-free-icons"

import { TaskBoardCard } from "@/components/task-board/task-board-card"
import { TaskOrderedDragBlocker } from "@/components/task-list/task-ordered-drag-blocker"
import { TaskStatusIcon } from "@/components/task-list/task-status-icon"
import { Button } from "@/components/ui/button"
import { isManualTaskOrder, STATUS_CONFIG, type TaskOrderBy } from "@/lib/tasks/constants"
import type { Task, TaskStatus, TaskUpdateHandlers } from "@/lib/tasks/types"
import { cn } from "@/lib/utils"

type TaskBoardColumnProps = {
  status: TaskStatus
  tasks: Task[]
  orderBy: TaskOrderBy
  activeDragStatus: TaskStatus | null
  onTaskClick: (task: Task) => void
  onAddTask: (status: TaskStatus) => void
} & TaskUpdateHandlers

export function TaskBoardColumn({
  status,
  tasks,
  orderBy,
  activeDragStatus,
  onPriorityChange,
  onStatusChange,
  onTaskClick,
  onAddTask,
}: TaskBoardColumnProps) {
  const config = STATUS_CONFIG[status]
  const taskIds = tasks.map((task) => task.id)
  const showOrderedDragBlocker =
    activeDragStatus === status && !isManualTaskOrder(orderBy)
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex w-full min-w-[280px] max-w-[350px] rounded-xl bg-muted/80 shrink-0 flex-col">
      <div className="flex items-center gap-2 p-3">
        <TaskStatusIcon status={status} />
        <span className="text-sm font-medium">{config.label}</span>
        <span className="text-xs text-muted-foreground">{tasks.length}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="ml-auto size-6"
          aria-label={`Add task to ${config.label}`}
          onClick={() => onAddTask(status)}
        >
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-3.5" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "relative flex min-h-[200px] flex-1 flex-col gap-3 p-3 pt-0 transition-colors",
          isOver && "bg-muted/50"
        )}
      >
        <TaskOrderedDragBlocker
          orderBy={orderBy}
          visible={showOrderedDragBlocker}
        />
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskBoardCard
                key={task.id}
                task={task}
                onPriorityChange={onPriorityChange}
                onStatusChange={onStatusChange}
                onTaskClick={onTaskClick}
              />
            ))
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/60 p-6 text-xs text-muted-foreground">
              Drop tasks here
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  )
}
