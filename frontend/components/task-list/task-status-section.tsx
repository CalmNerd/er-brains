"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

import { TaskOrderedDragBlocker } from "@/components/task-list/task-ordered-drag-blocker"
import { TaskRow } from "@/components/task-list/task-row"
import { TaskStatusIcon } from "@/components/task-list/task-status-icon"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { isManualTaskOrder, STATUS_CONFIG, type TaskOrderBy } from "@/lib/tasks/constants"
import type { Task, TaskStatus, TaskUpdateHandlers } from "@/lib/tasks/types"
import { cn } from "@/lib/utils"

type TaskStatusSectionProps = {
  status: TaskStatus
  tasks: Task[]
  orderBy: TaskOrderBy
  activeDragStatus: TaskStatus | null
  onTaskClick: (task: Task) => void
  onAddTask: (status: TaskStatus) => void
} & TaskUpdateHandlers

export function TaskStatusSection({
  status,
  tasks,
  orderBy,
  activeDragStatus,
  onPriorityChange,
  onStatusChange,
  onTaskClick,
  onAddTask,
}: TaskStatusSectionProps) {
  const config = STATUS_CONFIG[status]
  const taskIds = tasks.map((task) => task.id)
  const showOrderedDragBlocker =
    activeDragStatus === status && !isManualTaskOrder(orderBy)

  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <Collapsible defaultOpen={config.defaultExpanded} className="group/section">
      <div
        className={cn(
          "mb-[1px] flex items-center gap-1 rounded-md border p-2 transition-colors",
          config.triggerClassName
        )}
      >
        <CollapsibleTrigger className="flex size-5 shrink-0 items-center justify-center rounded outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className="size-3.5 text-muted-foreground transition-transform group-data-[open]/section:rotate-90"
          />
        </CollapsibleTrigger>

        <TaskStatusIcon status={status} />

        <CollapsibleTrigger className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 rounded px-1 py-0.5 text-xs font-medium text-foreground outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
          <span>{config.label}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {tasks.length}
          </span>
        </CollapsibleTrigger>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="size-5 shrink-0"
          aria-label={`Add task to ${config.label}`}
          onClick={() => onAddTask(status)}
        >
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-3.5" />
        </Button>
      </div>

      <CollapsibleContent>
        <div
          ref={setNodeRef}
          data-over={isOver}
          className={cn(
            "relative min-h-0 rounded-md transition-colors",
            isOver && "bg-muted/30"
          )}
        >
          <TaskOrderedDragBlocker
            orderBy={orderBy}
            visible={showOrderedDragBlocker}
          />
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onPriorityChange={onPriorityChange}
                  onStatusChange={onStatusChange}
                  onTaskClick={onTaskClick}
                />
              ))
            ) : (
              <div className="flex h-9 items-center px-3 text-xs text-muted-foreground">
                No tasks
              </div>
            )}
          </SortableContext>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
