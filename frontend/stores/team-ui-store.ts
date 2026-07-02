import { create } from "zustand"

const SELECTED_TEAM_KEY = "er-brains.selected-team-id"

function readPersistedTeamId(): number | null {
  if (typeof window === "undefined") {
    return null
  }

  const value = window.sessionStorage.getItem(SELECTED_TEAM_KEY)

  if (!value) {
    return null
  }

  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

function persistTeamId(teamId: number | null) {
  if (typeof window === "undefined") {
    return
  }

  if (teamId === null) {
    window.sessionStorage.removeItem(SELECTED_TEAM_KEY)
    return
  }

  window.sessionStorage.setItem(SELECTED_TEAM_KEY, String(teamId))
}

function clearPersistedTeamId() {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.removeItem(SELECTED_TEAM_KEY)
}

type TeamUiState = {
  selectedTeamId: number | null
  editingTeamId: string | null
  setSelectedTeamId: (teamId: number | null) => void
  setEditingTeamId: (editingTeamId: string | null) => void
  reset: () => void
}

export const useTeamUiStore = create<TeamUiState>((set) => ({
  selectedTeamId: readPersistedTeamId(),
  editingTeamId: null,
  setSelectedTeamId: (teamId) => {
    persistTeamId(teamId)
    set({ selectedTeamId: teamId })
  },
  setEditingTeamId: (editingTeamId) => set({ editingTeamId }),
  reset: () => {
    clearPersistedTeamId()
    set({ selectedTeamId: null, editingTeamId: null })
  },
}))
