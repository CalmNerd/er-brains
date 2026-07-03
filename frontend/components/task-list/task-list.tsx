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
import { TaskListEmpty } from "@/components/task-list/task-list-empty"
import { TaskListError } from "@/components/task-list/task-list-error"
import { TaskListSkeleton } from "@/components/task-list/task-list-skeleton"
import { TaskListToolbar } from "@/components/task-list/task-list-toolbar"
import { TaskListView } from "@/components/task-list/task-list-view"
import { TaskModal } from "@/components/task-modal/task-modal"
import { TaskDueDate } from "@/components/task-list/task-due-date"
import { PriorityIndicator } from "@/components/task-list/priority-indicator"
import { TaskStatusIcon } from "@/components/task-list/task-status-icon"
import { useManualTaskOrder } from "@/hooks/use-manual-task-order"
import { useTasks } from "@/hooks/queries/use-tasks"
import { useTaskDnd } from "@/hooks/use-task-dnd"
import {
  ACTIVE_STATUSES,
  isManualTaskOrder,
  STATUS_ORDER,
} from "@/lib/tasks/constants"
import {
  applyManualOrderToGrouped,
  applyOrderToGrouped,
  findTaskById,
  formatTaskId,
  groupTasksByStatus,
} from "@/lib/tasks/utils"
import type { Task, TaskId, TaskStatus } from "@/lib/tasks/types"
import {
  buildTaskFormValues,
  formValuesToCreateInput,
  taskToFormValues,
  TOOLBAR_CREATE_DEFAULTS,
  type TaskFormValues,
} from "@/lib/tasks/task-form"
import { useTaskUiStore } from "@/stores/task-ui-store"
import { useTeamNav } from "@/hooks/use-team-nav"

function ListDragOverlay({ task }: { task: Task }) {
  return (
    <div className="flex h-9 cursor-grabbing items-center gap-2 rounded-md border bg-background px-3 shadow-md">
      <PriorityIndicator priority={task.priority} />
      <span className="w-14 shrink-0 text-xs text-muted-foreground">
        {formatTaskId(task.id)}
      </span>
      <TaskStatusIcon status={task.status} />
      <span className="min-w-0 flex-1 truncate text-sm">{task.title}</span>
      <TaskDueDate task={task} className="shrink-0" />
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
          <TaskDueDate task={task} />
        </div>
        <PriorityIndicator priority={task.priority} />
        <TaskStatusIcon status={task.status} />
      </div>
    </div>
  )
}

export function TaskList() {
  const sortableId = React.useId()
  const view = useTaskUiStore((state) => state.view)
  const layout = useTaskUiStore((state) => state.layout)
  const orderBy = useTaskUiStore((state) => state.orderBy)
  const sortDirection = useTaskUiStore((state) => state.sortDirection)
  const setView = useTaskUiStore((state) => state.setView)
  const setLayout = useTaskUiStore((state) => state.setLayout)
  const setOrderBy = useTaskUiStore((state) => state.setOrderBy)
  const setSortDirection = useTaskUiStore((state) => state.setSortDirection)
  const resetFilters = useTaskUiStore((state) => state.resetFilters)
  const modalState = useTaskUiStore((state) => state.modalState)
  const setModalState = useTaskUiStore((state) => state.setModalState)
  const closeModal = useTaskUiStore((state) => state.closeModal)

  const { selectedTeamId, teams, isLoading: isTeamsLoading, isResolvingTeam } =
    useTeamNav()
  const activeTeamName =
    teams.find((team) => team.id === selectedTeamId)?.name ?? "Team"

  const {
    tasks,
    isLoading: isTasksLoading,
    isError,
    error,
    refetch,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks()

  const isLoading = isTeamsLoading || isResolvingTeam || isTasksLoading
  const hasNoTeams = !isTeamsLoading && teams.length === 0

  const handleSilentUpdate = React.useCallback(
    (taskId: TaskId, updates: Parameters<typeof updateTask>[1]) => {
      void updateTask(taskId, updates, true)
    },
    [updateTask]
  )

  const {
    manualOrder,
    reorderWithinStatus,
    moveAcrossStatus,
  } = useManualTaskOrder({
    teamId: selectedTeamId,
    tasks,
  })

  const tasksByStatus = React.useMemo(() => groupTasksByStatus(tasks), [tasks])

  const orderedTasksByStatus = React.useMemo(() => {
    if (isManualTaskOrder(orderBy)) {
      return applyManualOrderToGrouped(tasksByStatus, manualOrder)
    }

    return applyOrderToGrouped(tasksByStatus, orderBy, sortDirection)
  }, [tasksByStatus, manualOrder, orderBy, sortDirection])

  const {
    sortableIds,
    sensors,
    handleDragEnd,
    updateTaskPriority,
    updateTaskStatus,
  } = useTaskDnd({
    displayedTasksByStatus: orderedTasksByStatus,
    orderBy,
    onUpdateTask: handleSilentUpdate,
    onReorderWithinStatus: reorderWithinStatus,
    onMoveAcrossStatus: moveAcrossStatus,
  })

  const [activeTask, setActiveTask] = React.useState<Task | null>(null)

  const activeDragStatus = activeTask?.status ?? null

  const filters = React.useMemo(
    () => ({ view, layout, orderBy, sortDirection }),
    [view, layout, orderBy, sortDirection]
  )

  const visibleStatuses = React.useMemo<readonly TaskStatus[]>(
    () => (view === "active" ? ACTIVE_STATUSES : STATUS_ORDER),
    [view]
  )

  const openCreateModal = React.useCallback(
    (defaults?: Partial<TaskFormValues>) => {
      setModalState({
        open: true,
        mode: "create",
        initialValues: buildTaskFormValues(defaults),
      })
    },
    [setModalState]
  )

  const openCreateModalForStatus = React.useCallback(
    (status: TaskStatus) => {
      openCreateModal({ status })
    },
    [openCreateModal]
  )

  const openEditModal = React.useCallback(
    (task: Task) => {
      setModalState({
        open: true,
        mode: "edit",
        taskId: task.id,
        initialValues: taskToFormValues(task),
      })
    },
    [setModalState]
  )

  const handleDragStart = React.useCallback(
    (event: DragStartEvent) => {
      const task = findTaskById(Number(event.active.id), orderedTasksByStatus)
      setActiveTask(task ?? null)
    },
    [orderedTasksByStatus]
  )

  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      handleDragEnd(event)
      setActiveTask(null)
    },
    [handleDragEnd]
  )

  const handleCreateTask = React.useCallback(
    async (values: TaskFormValues, createMore: boolean) => {
      await createTask(formValuesToCreateInput(values))

      if (!createMore) {
        closeModal()
      }
    },
    [closeModal, createTask]
  )

  const handleUpdateTask = React.useCallback(
    async (taskId: TaskId, values: TaskFormValues) => {
      await updateTask(taskId, formValuesToCreateInput(values))
      closeModal()
    },
    [closeModal, updateTask]
  )

  const handleDeleteTask = React.useCallback(
    async (taskId: TaskId) => {
      await deleteTask(taskId)
      closeModal()
    },
    [closeModal, deleteTask]
  )

  if (hasNoTeams) {
    return (
      <div className="flex w-full flex-col px-4 lg:px-6">
        <TaskListEmpty onCreateTask={() => openCreateModal(TOOLBAR_CREATE_DEFAULTS)} />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col px-4 lg:px-6">
      <TaskListToolbar
        filters={filters}
        onViewChange={setView}
        onLayoutChange={setLayout}
        onOrderByChange={setOrderBy}
        onSortDirectionChange={setSortDirection}
        onResetFilters={resetFilters}
        onCreateTask={() => openCreateModal(TOOLBAR_CREATE_DEFAULTS)}
      />

      <TaskModal
        open={modalState.open}
        mode={modalState.open ? modalState.mode : "create"}
        teamName={activeTeamName}
        initialValues={
          modalState.open
            ? modalState.initialValues
            : buildTaskFormValues()
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
        onDelete={handleDeleteTask}
      />

      {isLoading ? <TaskListSkeleton layout={layout} /> : null}

      {!isLoading && isError ? (
        <TaskListError error={error} onRetry={() => void refetch()} />
      ) : null}

      {!isLoading && !isError && tasks.length === 0 ? (
        <TaskListEmpty onCreateTask={() => openCreateModal(TOOLBAR_CREATE_DEFAULTS)} />
      ) : null}

      {!isLoading && !isError && tasks.length > 0 ? (
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
                orderBy={orderBy}
                activeDragStatus={activeDragStatus}
                onPriorityChange={updateTaskPriority}
                onStatusChange={updateTaskStatus}
                onTaskClick={openEditModal}
                onAddTask={openCreateModalForStatus}
              />
            ) : (
              <TaskBoardView
                visibleStatuses={visibleStatuses}
                tasksByStatus={orderedTasksByStatus}
                orderBy={orderBy}
                activeDragStatus={activeDragStatus}
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
      ) : null}
    </div>
  )
}
