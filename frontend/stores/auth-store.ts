import { create } from "zustand"

import type { AuthUser } from "@/lib/auth/types"

type AuthState = {
  user: AuthUser | null
  isHydrated: boolean
  setUser: (user: AuthUser | null) => void
  setHydrated: (isHydrated: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,
  setUser: (user) => set({ user }),
  setHydrated: (isHydrated) => set({ isHydrated }),
  reset: () => set({ user: null, isHydrated: true }),
}))
