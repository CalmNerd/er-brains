"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { ApiError } from "@/lib/api/types"
import { queryKeys } from "@/lib/query/keys"
import {
  revertOptimisticUpdate,
  runOptimisticUpdate,
} from "@/lib/query/optimistic"
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from "@/lib/tasks/api"
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/lib/tasks/types"
import { useTeamUiStore } from "@/stores/team-ui-store"

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback
}

function createOptimisticTask(input: CreateTaskInput): Task {
  return {
    ...input,
    id: -Date.now(),
  }
}

export function useTasks() {
  const queryClient = useQueryClient()
  const selectedTeamId = useTeamUiStore((state) => state.selectedTeamId)

  const query = useQuery({
    queryKey: selectedTeamId
      ? queryKeys.tasks.byTeam(selectedTeamId)
      : queryKeys.tasks.all,
    queryFn: () => {
      if (!selectedTeamId) {
        return Promise.resolve([])
      }

      return listTasks({ teamId: selectedTeamId })
    },
    enabled: selectedTeamId !== null,
  })

  const createTaskMutation = useMutation({
    mutationFn: (input: CreateTaskInput) => {
      if (!selectedTeamId) {
        throw new ApiError("Select a team before creating tasks")
      }

      return createTask({ ...input, teamId: selectedTeamId })
    },
    onMutate: async (input) => {
      if (!selectedTeamId) {
        return undefined
      }

      const queryKey = queryKeys.tasks.byTeam(selectedTeamId)

      return runOptimisticUpdate<Task[]>({
        queryClient,
        queryKey,
        updater: (current = []) => [
          createOptimisticTask(input),
          ...current,
        ],
      })
    },
    onSuccess: () => {
      toast.success("Task created")
    },
    onError: (error, _input, context) => {
      if (selectedTeamId) {
        revertOptimisticUpdate(
          queryClient,
          queryKeys.tasks.byTeam(selectedTeamId),
          context
        )
      }

      toast.error(getErrorMessage(error, "Unable to create task"))
    },
    onSettled: () => {
      if (selectedTeamId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tasks.byTeam(selectedTeamId),
        })
      }
    },
  })

  const updateTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      input,
      silent = false,
    }: {
      taskId: number
      input: UpdateTaskInput
      silent?: boolean
    }) => updateTask(taskId, input),
    onMutate: async ({ taskId, input }) => {
      if (!selectedTeamId) {
        return undefined
      }

      const queryKey = queryKeys.tasks.byTeam(selectedTeamId)

      return runOptimisticUpdate<Task[]>({
        queryClient,
        queryKey,
        updater: (current = []) =>
          current.map((task) =>
            task.id === taskId ? { ...task, ...input } : task
          ),
      })
    },
    onSuccess: (_data, variables) => {
      if (!variables.silent) {
        toast.success("Task updated")
      }
    },
    onError: (error, _variables, context) => {
      if (selectedTeamId) {
        revertOptimisticUpdate(
          queryClient,
          queryKeys.tasks.byTeam(selectedTeamId),
          context
        )
      }

      toast.error(getErrorMessage(error, "Unable to update task"))
    },
    onSettled: () => {
      if (selectedTeamId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tasks.byTeam(selectedTeamId),
        })
      }
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onMutate: async (taskId) => {
      if (!selectedTeamId) {
        return undefined
      }

      const queryKey = queryKeys.tasks.byTeam(selectedTeamId)

      return runOptimisticUpdate<Task[]>({
        queryClient,
        queryKey,
        updater: (current = []) =>
          current.filter((task) => task.id !== taskId),
      })
    },
    onSuccess: () => {
      toast.success("Task deleted")
    },
    onError: (error, _taskId, context) => {
      if (selectedTeamId) {
        revertOptimisticUpdate(
          queryClient,
          queryKeys.tasks.byTeam(selectedTeamId),
          context
        )
      }

      toast.error(getErrorMessage(error, "Unable to delete task"))
    },
    onSettled: () => {
      if (selectedTeamId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tasks.byTeam(selectedTeamId),
        })
      }
    },
  })

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    selectedTeamId,
    createTask: createTaskMutation.mutateAsync,
    updateTask: (taskId: number, input: UpdateTaskInput, silent = false) =>
      updateTaskMutation.mutateAsync({ taskId, input, silent }),
    deleteTask: deleteTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  }
}
