"use client"

import { useCallback, useMemo, useState } from "react"

import type { NavCollapsibleGroup } from "@/components/nav-collapsible"
import { useTeams } from "@/hooks/queries/use-teams"
import { useTeamUiStore } from "@/stores/team-ui-store"

const TEAMS_GROUP_TITLE = "Your Teams"

type DraftTeam = {
  id: string
  title: string
  isDraft: true
}

function createDraftTeamId() {
  return `draft-${crypto.randomUUID()}`
}

function parseTeamId(itemId: string): number | null {
  if (itemId.startsWith("draft-")) {
    return null
  }

  const parsed = Number(itemId)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

export function useTeamNav() {
  const {
    teams,
    isLoading,
    isError,
    error,
    refetch,
    createTeam,
    updateTeam,
    deleteTeam,
  } = useTeams()

  const selectedTeamId = useTeamUiStore((state) => state.selectedTeamId)
  const setSelectedTeamId = useTeamUiStore((state) => state.setSelectedTeamId)
  const editingTeamId = useTeamUiStore((state) => state.editingTeamId)
  const setEditingTeamId = useTeamUiStore((state) => state.setEditingTeamId)

  const [draftTeams, setDraftTeams] = useState<DraftTeam[]>([])

  const groups = useMemo<NavCollapsibleGroup[]>(() => {
    const items = [
      ...teams.map((team) => ({
        id: String(team.id),
        title: team.name,
        url: "#",
        isActive: team.id === selectedTeamId,
      })),
      ...draftTeams.map((team) => ({
        id: team.id,
        title: team.title,
        url: "#",
        isDraft: true,
      })),
    ]

    return [
      {
        title: TEAMS_GROUP_TITLE,
        url: "#",
        items,
      },
    ]
  }, [draftTeams, selectedTeamId, teams])

  const addTeam = useCallback(() => {
    const draftId = createDraftTeamId()

    setDraftTeams((current) => [
      ...current,
      { id: draftId, title: "", isDraft: true },
    ])
    setEditingTeamId(draftId)
  }, [setEditingTeamId])

  const renameTeam = useCallback(
    async (groupTitle: string, itemId: string, title: string) => {
      if (groupTitle !== TEAMS_GROUP_TITLE) {
        return
      }

      const trimmedTitle = title.trim()
      const teamId = parseTeamId(itemId)
      const isDraft = itemId.startsWith("draft-")

      if (!trimmedTitle) {
        if (isDraft) {
          setDraftTeams((current) => current.filter((team) => team.id !== itemId))
        } else if (teamId !== null) {
          await deleteTeam(teamId)
        }

        setEditingTeamId(null)
        return
      }

      if (isDraft) {
        const createdTeam = await createTeam({ name: trimmedTitle })
        setDraftTeams((current) => current.filter((team) => team.id !== itemId))
        setSelectedTeamId(createdTeam.id)
        setEditingTeamId(null)
        return
      }

      if (teamId !== null) {
        await updateTeam({ teamId, input: { name: trimmedTitle } })
        setEditingTeamId(null)
      }
    },
    [createTeam, deleteTeam, setEditingTeamId, setSelectedTeamId, updateTeam]
  )

  const cancelEdit = useCallback(
    (groupTitle: string, itemId: string) => {
      if (groupTitle !== TEAMS_GROUP_TITLE) {
        return
      }

      if (itemId.startsWith("draft-")) {
        setDraftTeams((current) => current.filter((team) => team.id !== itemId))
      }

      setEditingTeamId(null)
    },
    [setEditingTeamId]
  )

  const startEditTeam = useCallback(
    (itemId: string) => {
      setEditingTeamId(itemId)
    },
    [setEditingTeamId]
  )

  const deleteTeamItem = useCallback(
    async (groupTitle: string, itemId: string) => {
      if (groupTitle !== TEAMS_GROUP_TITLE) {
        return
      }

      if (itemId.startsWith("draft-")) {
        setDraftTeams((current) => current.filter((team) => team.id !== itemId))
        setEditingTeamId(null)
        return
      }

      const teamId = parseTeamId(itemId)

      if (teamId !== null) {
        await deleteTeam(teamId)
      }

      setEditingTeamId(null)
    },
    [deleteTeam, setEditingTeamId]
  )

  const selectTeam = useCallback(
    (itemId: string) => {
      const teamId = parseTeamId(itemId)

      if (teamId !== null) {
        setSelectedTeamId(teamId)
      }
    },
    [setSelectedTeamId]
  )

  return {
    groups,
    isLoading,
    isError,
    error,
    refetch,
    editingTeamId,
    addTeam,
    renameTeam,
    cancelEdit,
    startEditTeam,
    deleteTeam: deleteTeamItem,
    selectTeam,
    selectedTeamId,
    teams,
  }
}
