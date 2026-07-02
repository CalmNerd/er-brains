"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { useCurrentUser } from "@/hooks/queries/use-current-user"
import { getAuthToken } from "@/lib/auth/storage"
import { Skeleton } from "@/components/ui/skeleton"

function AuthGuardFallback() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isLoading } = useCurrentUser()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || getAuthToken()) {
      return
    }

    router.replace("/login")
  }, [isMounted, router])

  if (!isMounted) {
    return <AuthGuardFallback />
  }

  if (!getAuthToken()) {
    return null
  }

  if (isLoading) {
    return <AuthGuardFallback />
  }

  return <>{children}</>
}
