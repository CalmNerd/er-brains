import type { TaskPriority } from "@/lib/tasks/types"

export type AiSuggestRequest = {
  title?: string
  description?: string
}

export type AiSuggestResponse = {
  title: string
  description: string
  priority: TaskPriority
}

export type AiSuggestionField = "title" | "description" | "priority"

export type AiSuggestionTriggerField = "title" | "description"

export type FieldSuggestionStatus =
  | "idle"
  | "loading"
  | "pending"
  | "accepted"
  | "rejected"
