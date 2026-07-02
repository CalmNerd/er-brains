"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { useCurrentUser } from "@/hooks/queries/use-current-user"
import { getAuthToken } from "@/lib/auth/storage"
import { Skeleton } from "@/components/ui/skeleton"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isLoading } = useCurrentUser()

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace("/login")
    }
  }, [router])

  if (!getAuthToken()) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return <>{children}</>
}
