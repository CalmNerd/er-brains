"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

import { getCurrentUser } from "@/lib/auth/api"
import { getAuthToken } from "@/lib/auth/storage"
import { queryKeys } from "@/lib/query/keys"
import { useAuthStore } from "@/stores/auth-store"

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser)
  const setHydrated = useAuthStore((state) => state.setHydrated)
  const user = useAuthStore((state) => state.user)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  const query = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getCurrentUser,
    enabled: Boolean(getAuthToken()),
    retry: false,
  })

  useEffect(() => {
    if (!getAuthToken()) {
      setUser(null)
      setHydrated(true)
      return
    }

    if (query.isSuccess) {
      setUser(query.data)
      setHydrated(true)
    }

    if (query.isError) {
      setUser(null)
      setHydrated(true)
    }
  }, [query.data, query.isError, query.isSuccess, setHydrated, setUser])

  return {
    user: query.data ?? user,
    isLoading: !isHydrated || query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
