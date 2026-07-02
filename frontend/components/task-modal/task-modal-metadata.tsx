"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon, Tick02Icon } from "@hugeicons/core-free-icons"

import { SuggestionFieldActions } from "@/components/task-modal/suggestion-field"
import { PriorityIndicator } from "@/components/task-list/priority-indicator"
import { TaskStatusIcon } from "@/components/task-list/task-status-icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import type { FieldSuggestionStatus } from "@/lib/ai/types"
import { formatDueDate } from "@/lib/tasks/utils"
import type { TaskFormValues } from "@/lib/tasks/task-form"
import { TASK_PRIORITIES, TASK_STATUSES, type TaskPriority } from "@/lib/tasks/types"
import { cn } from "@/lib/utils"

type TaskModalMetadataProps = {
  values: TaskFormValues
  onChange: <K extends keyof TaskFormValues>(
    key: K,
    value: TaskFormValues[K]
  ) => void
  priorityDisplay?: TaskPriority
  prioritySuggestionStatus?: FieldSuggestionStatus
  onAcceptPriority?: () => void
  onRejectPriority?: () => void
}

function MetadataPill({
  children,
  className,
  muted = false,
}: {
  children: React.ReactNode
  className?: string
  muted?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 text-xs font-medium transition-colors hover:bg-muted/50",
        muted ? "text-muted-foreground" : "text-foreground",
        className
      )}
    >
      {children}
    </span>
  )
}

export function TaskModalMetadata({
  values,
  onChange,
  priorityDisplay,
  prioritySuggestionStatus = "idle",
  onAcceptPriority,
  onRejectPriority,
}: TaskModalMetadataProps) {
  const displayedPriority = priorityDisplay ?? values.priority
  const isPriorityPending = prioritySuggestionStatus === "pending"

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Change status"
        >
          <MetadataPill>
            <TaskStatusIcon status={values.status} />
            <span>{values.status}</span>
          </MetadataPill>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40">
          {TASK_STATUSES.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => onChange("status", option)}
              className="gap-2"
            >
              <TaskStatusIcon status={option} />
              <span className="flex-1">{option}</span>
              {values.status === option ? (
                <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3.5" />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {isPriorityPending ? (
        <MetadataPill muted className="gap-1 pr-1">
          <PriorityIndicator priority={displayedPriority} className="size-3.5" />
          <span>{displayedPriority}</span>
          {onAcceptPriority && onRejectPriority ? (
            <SuggestionFieldActions
              onAccept={onAcceptPriority}
              onReject={onRejectPriority}
              className="ml-0.5"
            />
          ) : null}
        </MetadataPill>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Change priority"
          >
            <MetadataPill>
              <PriorityIndicator priority={displayedPriority} className="size-3.5" />
              <span>{displayedPriority}</span>
            </MetadataPill>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-36">
            {TASK_PRIORITIES.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => onChange("priority", option)}
                className="gap-2"
              >
                <PriorityIndicator priority={option} className="size-3.5" />
                <span className="flex-1">{option}</span>
                {values.priority === option ? (
                  <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3.5" />
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger
          className="outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Change due date"
        >
          <MetadataPill>
            <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3.5" />
            <span>{formatDueDate(values.dueDate)}</span>
          </MetadataPill>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 p-3">
          <Input
            type="date"
            value={values.dueDate}
            onChange={(event) => onChange("dueDate", event.target.value)}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
