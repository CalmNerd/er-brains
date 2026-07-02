import { clearAuthToken } from "@/lib/auth/storage"
import { queryClient } from "@/lib/query/client"
import { useAuthStore } from "@/stores/auth-store"
import { useTaskUiStore } from "@/stores/task-ui-store"
import { useTeamUiStore } from "@/stores/team-ui-store"

/** Clears auth, client stores, and cached server data. */
export function clearAppState() {
  clearAuthToken()
  useAuthStore.getState().reset()
  useTaskUiStore.getState().reset()
  useTeamUiStore.getState().reset()
  queryClient.clear()
}

/** Full sign-out — use for manual logout and 401 handling. */
export function logout() {
  clearAppState()
}
