"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { STATUS_ORDER } from "@/lib/tasks/constants"
import type { TaskLayout } from "@/lib/tasks/constants"

type TaskListSkeletonProps = {
  layout?: TaskLayout
}

export function TaskListSkeleton({ layout = "list" }: TaskListSkeletonProps) {
  if (layout === "board") {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {STATUS_ORDER.map((status) => (
          <div key={status} className="space-y-3 rounded-lg border p-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {STATUS_ORDER.map((status) => (
        <div key={status} className="space-y-2">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  )
}
