"use client"

import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api/types"

type TaskListErrorProps = {
  error: unknown
  onRetry: () => void
}

export function TaskListError({ error, onRetry }: TaskListErrorProps) {
  const message =
    error instanceof ApiError
      ? error.message
      : "Unable to load tasks right now."

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center">
      <p className="text-sm font-medium">Failed to load tasks</p>
      <p className="text-muted-foreground max-w-md text-sm">{message}</p>
      <Button type="button" variant="outline" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}
