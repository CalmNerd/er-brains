"use client"

import { Button } from "@/components/ui/button"

type TaskListEmptyProps = {
  onCreateTask: () => void
}

export function TaskListEmpty({ onCreateTask }: TaskListEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center">
      <p className="text-sm font-medium">No tasks yet</p>
      <p className="text-muted-foreground max-w-md text-sm">
        Create your first task for this team to get started.
      </p>
      <Button type="button" onClick={onCreateTask}>
        Create task
      </Button>
    </div>
  )
}
