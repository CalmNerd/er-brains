"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useLayoutEffect } from "react"
import { toast } from "sonner"

import { ApiError } from "@/lib/api/types"
import { queryKeys } from "@/lib/query/keys"
import {
  revertOptimisticUpdate,
  runOptimisticUpdate,
} from "@/lib/query/optimistic"
import {
  createTeam,
  deleteTeam,
  listTeams,
  updateTeam,
} from "@/lib/teams/api"
import type { CreateTeamInput, Team, UpdateTeamInput } from "@/lib/teams/types"
import { useTeamUiStore } from "@/stores/team-ui-store"

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback
}

export function useTeams() {
  const queryClient = useQueryClient()
  const selectedTeamId = useTeamUiStore((state) => state.selectedTeamId)
  const setSelectedTeamId = useTeamUiStore((state) => state.setSelectedTeamId)

  const query = useQuery({
    queryKey: queryKeys.teams.all,
    queryFn: listTeams,
  })

  useLayoutEffect(() => {
    if (!query.isSuccess || query.data.length === 0) {
      return
    }

    const hasSelectedTeam =
      selectedTeamId !== null &&
      query.data.some((team) => team.id === selectedTeamId)

    if (!hasSelectedTeam) {
      setSelectedTeamId(query.data[0].id)
    }
  }, [query.data, query.isSuccess, selectedTeamId, setSelectedTeamId])

  const createTeamMutation = useMutation({
    mutationFn: (input: CreateTeamInput) => createTeam(input),
    onMutate: async (input) => {
      const context = await runOptimisticUpdate<Team[]>({
        queryClient,
        queryKey: queryKeys.teams.all,
        updater: (current = []) => [
          ...current,
          {
            id: -Date.now(),
            name: input.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      })

      return context
    },
    onSuccess: (team) => {
      setSelectedTeamId(team.id)
      toast.success("Team created")
    },
    onError: (error, _input, context) => {
      revertOptimisticUpdate(queryClient, queryKeys.teams.all, context)
      toast.error(getErrorMessage(error, "Unable to create team"))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.all })
    },
  })

  const updateTeamMutation = useMutation({
    mutationFn: ({
      teamId,
      input,
    }: {
      teamId: number
      input: UpdateTeamInput
    }) => updateTeam(teamId, input),
    onMutate: async ({ teamId, input }) => {
      const context = await runOptimisticUpdate<Team[]>({
        queryClient,
        queryKey: queryKeys.teams.all,
        updater: (current = []) =>
          current.map((team) =>
            team.id === teamId ? { ...team, name: input.name } : team
          ),
      })

      return context
    },
    onSuccess: () => {
      toast.success("Team updated")
    },
    onError: (error, _input, context) => {
      revertOptimisticUpdate(queryClient, queryKeys.teams.all, context)
      toast.error(getErrorMessage(error, "Unable to update team"))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.all })
    },
  })

  const deleteTeamMutation = useMutation({
    mutationFn: (teamId: number) => deleteTeam(teamId),
    onMutate: async (teamId) => {
      const context = await runOptimisticUpdate<Team[]>({
        queryClient,
        queryKey: queryKeys.teams.all,
        updater: (current = []) => current.filter((team) => team.id !== teamId),
      })

      const remainingTeams =
        queryClient
          .getQueryData<Team[]>(queryKeys.teams.all)
          ?.filter((team) => team.id !== teamId) ?? []

      if (selectedTeamId === teamId) {
        setSelectedTeamId(remainingTeams[0]?.id ?? null)
      }

      return context
    },
    onSuccess: () => {
      toast.success("Team deleted")
    },
    onError: (error, _teamId, context) => {
      revertOptimisticUpdate(queryClient, queryKeys.teams.all, context)
      toast.error(getErrorMessage(error, "Unable to delete team"))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
    },
  })

  return {
    teams: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createTeam: createTeamMutation.mutateAsync,
    updateTeam: updateTeamMutation.mutateAsync,
    deleteTeam: deleteTeamMutation.mutateAsync,
    isCreating: createTeamMutation.isPending,
    isUpdating: updateTeamMutation.isPending,
    isDeleting: deleteTeamMutation.isPending,
  }
}
