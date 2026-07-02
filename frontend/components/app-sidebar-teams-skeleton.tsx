"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function AppSidebarTeamsSkeleton() {
  return (
    <div className="space-y-2 px-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  )
}