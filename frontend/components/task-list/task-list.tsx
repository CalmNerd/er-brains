"use client"

import {
  DndContext,
  closestCorners,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon } from "@hugeicons/core-free-icons"

import { TaskBoardView } from "@/components/task-board/task-board-view"
import { TaskListToolbar } from "@/components/task-list/task-list-toolbar"
import { TaskListView } from "@/components/task-list/task-list-view"
import { TaskModal } from "@/components/task-modal/task-modal"
import { PriorityIndicator } from "@/components/task-list/priority-indicator"
import { TaskStatusIcon } from "@/components/task-list/task-status-icon"
import { useTaskDnd } from "@/hooks/use-task-dnd"
import { useTaskModal } from "@/hooks/use-task-modal"
import {
  ACTIVE_STATUSES,
  DEFAULT_TASK_FILTERS,
  STATUS_ORDER,
  type TaskLayout,
  type TaskOrderBy,
  type TaskView,
} from "@/lib/tasks/constants"
import {
  applyOrderToGrouped,
  findTaskById,
  formatDueDate,
  formatTaskId,
} from "@/lib/tasks/utils"
import type { Task, TaskStatus } from "@/lib/tasks/types"
import {
  formValuesToCreateInput,
  DEFAULT_TASK_FORM_VALUES,
  TOOLBAR_CREATE_DEFAULTS,
  type TaskFormValues,
} from "@/lib/tasks/task-form"

type TaskListProps = {
  data: Task[]
}

function ListDragOverlay({ task }: { task: Task }) {
  return (
    <div className="flex h-9 cursor-grabbing items-center gap-2 rounded-md border bg-background px-3 shadow-md">
      <PriorityIndicator priority={task.priority} />
      <span className="w-14 shrink-0 text-xs text-muted-foreground">
        {formatTaskId(task.id)}
      </span>
      <TaskStatusIcon status={task.status} />
      <span className="min-w-0 flex-1 truncate text-sm">{task.title}</span>
      <span className="shrink-0 text-xs text-muted-foreground">
        {formatDueDate(task.dueDate)}
      </span>
    </div>
  )
}

function BoardDragOverlay({ task }: { task: Task }) {
  return (
    <div className="w-[350px] cursor-grabbing rounded-lg border bg-card p-3 shadow-md">
      <div className="mb-2">
        <span className="text-sm font-medium">{task.title}</span>
      </div>
      <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
        {task.description}
      </p>
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 text-xs text-muted-foreground">
          <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3.5" />
          <span>{formatDueDate(task.dueDate)}</span>
        </div>
        <PriorityIndicator priority={task.priority} />
        <TaskStatusIcon status={task.status} />
      </div>
    </div>
  )
}

export function TaskList({ data }: TaskListProps) {
  const sortableId = React.useId()
  const [view, setView] = React.useState<TaskView>(DEFAULT_TASK_FILTERS.view)
  const [layout, setLayout] = React.useState<TaskLayout>(DEFAULT_TASK_FILTERS.layout)
  const [orderBy, setOrderBy] = React.useState<TaskOrderBy>(DEFAULT_TASK_FILTERS.orderBy)
  const {
    tasksByStatus,
    sortableIds,
    sensors,
    handleDragEnd,
    updateTaskPriority,
    updateTaskStatus,
    createTask,
    updateTask,
    deleteTask,
  } = useTaskDnd({ initialTasks: data })
  const {
    modalState,
    openCreateModal,
    openCreateModalForStatus,
    openEditModal,
    closeModal,
  } = useTaskModal()
  const [activeTask, setActiveTask] = React.useState<Task | null>(null)

  const filters = React.useMemo(
    () => ({ view, layout, orderBy }),
    [view, layout, orderBy]
  )

  const visibleStatuses = React.useMemo<readonly TaskStatus[]>(
    () => (view === "active" ? ACTIVE_STATUSES : STATUS_ORDER),
    [view]
  )

  const orderedTasksByStatus = React.useMemo(
    () => applyOrderToGrouped(tasksByStatus, orderBy),
    [tasksByStatus, orderBy]
  )

  const handleResetFilters = React.useCallback(() => {
    setView(DEFAULT_TASK_FILTERS.view)
    setLayout(DEFAULT_TASK_FILTERS.layout)
    setOrderBy(DEFAULT_TASK_FILTERS.orderBy)
  }, [])

  const handleDragStart = React.useCallback(
    (event: DragStartEvent) => {
      const task = findTaskById(Number(event.active.id), tasksByStatus)
      setActiveTask(task ?? null)
    },
    [tasksByStatus]
  )

  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      handleDragEnd(event)
      setActiveTask(null)
    },
    [handleDragEnd]
  )

  const handleCreateTask = React.useCallback(
    (values: TaskFormValues) => {
      createTask(formValuesToCreateInput(values))
    },
    [createTask]
  )

  const handleUpdateTask = React.useCallback(
    (taskId: number, values: TaskFormValues) => {
      updateTask(taskId, formValuesToCreateInput(values))
    },
    [updateTask]
  )

  return (
    <div className="flex w-full flex-col px-4 lg:px-6">
      <TaskListToolbar
        filters={filters}
        onViewChange={setView}
        onLayoutChange={setLayout}
        onOrderByChange={setOrderBy}
        onResetFilters={handleResetFilters}
        onCreateTask={() => openCreateModal(TOOLBAR_CREATE_DEFAULTS)}
      />

      <TaskModal
        open={modalState.open}
        mode={modalState.open ? modalState.mode : "create"}
        initialValues={
          modalState.open
            ? modalState.initialValues
            : DEFAULT_TASK_FORM_VALUES
        }
        taskId={
          modalState.open && modalState.mode === "edit"
            ? modalState.taskId
            : undefined
        }
        onOpenChange={(open) => {
          if (!open) {
            closeModal()
          }
        }}
        onCreate={handleCreateTask}
        onUpdate={handleUpdateTask}
        onDelete={deleteTask}
      />

      <DndContext
        id={sortableId}
        sensors={sensors}
        collisionDetection={closestCorners}
        modifiers={layout === "list" ? [restrictToVerticalAxis] : undefined}
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
        <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
          {layout === "list" ? (
            <TaskListView
              visibleStatuses={visibleStatuses}
              tasksByStatus={orderedTasksByStatus}
              onPriorityChange={updateTaskPriority}
              onStatusChange={updateTaskStatus}
              onTaskClick={openEditModal}
              onAddTask={openCreateModalForStatus}
            />
          ) : (
            <TaskBoardView
              visibleStatuses={visibleStatuses}
              tasksByStatus={orderedTasksByStatus}
              onPriorityChange={updateTaskPriority}
              onStatusChange={updateTaskStatus}
              onTaskClick={openEditModal}
              onAddTask={openCreateModalForStatus}
            />
          )}
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            layout === "list" ? (
              <ListDragOverlay task={activeTask} />
            ) : (
              <BoardDragOverlay task={activeTask} />
            )
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
