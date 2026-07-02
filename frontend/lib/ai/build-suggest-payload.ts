import type { AiSuggestRequest, AiSuggestionTriggerField } from "@/lib/ai/types"
import type { TaskFormValues } from "@/lib/tasks/task-form"

const MIN_TITLE_LENGTH = 3
const MIN_DESCRIPTION_LENGTH = 10

export function canTriggerAiSuggestion(
  values: Pick<TaskFormValues, "title" | "description">,
  triggerField: AiSuggestionTriggerField
): boolean {
  const titleLength = values.title.trim().length
  const descriptionLength = values.description.trim().length

  if (triggerField === "title") {
    return titleLength >= MIN_TITLE_LENGTH
  }

  return descriptionLength >= MIN_DESCRIPTION_LENGTH
}

export function buildSuggestPayload(
  values: Pick<TaskFormValues, "title" | "description">,
  triggerField: AiSuggestionTriggerField
): AiSuggestRequest | null {
  if (!canTriggerAiSuggestion(values, triggerField)) {
    return null
  }

  const title = values.title.trim()
  const description = values.description.trim()

  const payload: AiSuggestRequest = {}

  if (title) {
    payload.title = title
  }

  if (description) {
    payload.description = description
  }

  if (!payload.title && !payload.description) {
    return null
  }

  return payload
}
