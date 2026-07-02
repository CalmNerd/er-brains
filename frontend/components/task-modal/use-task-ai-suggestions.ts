"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { suggestTask } from "@/lib/ai/api"
import { buildSuggestPayload } from "@/lib/ai/build-suggest-payload"
import type {
  AiSuggestionField,
  AiSuggestionTriggerField,
  AiSuggestResponse,
  FieldSuggestionStatus,
} from "@/lib/ai/types"
import type { TaskFormValues } from "@/lib/tasks/task-form"
import type { TaskPriority } from "@/lib/tasks/types"

const DEBOUNCE_MS = 800

type FieldStatuses = Record<AiSuggestionField, FieldSuggestionStatus>

const INITIAL_FIELD_STATUSES: FieldStatuses = {
  title: "idle",
  description: "idle",
  priority: "idle",
}

type DraftValues = Pick<TaskFormValues, "title" | "description">

type UseTaskAiSuggestionsParams = {
  enabled: boolean
  open: boolean
  values: TaskFormValues
  onApplyField: <K extends keyof TaskFormValues>(
    key: K,
    value: TaskFormValues[K]
  ) => void
}

function resolvePendingStatuses(
  suggestion: AiSuggestResponse,
  committed: TaskFormValues
): FieldStatuses {
  return {
    title:
      suggestion.title.trim() !== committed.title.trim() ? "pending" : "idle",
    description:
      suggestion.description.trim() !== committed.description.trim()
        ? "pending"
        : "idle",
    priority:
      suggestion.priority !== committed.priority ? "pending" : "idle",
  }
}

function hasPendingFields(statuses: FieldStatuses): boolean {
  return Object.values(statuses).some((status) => status === "pending")
}

function clearSuggestionIfDone(
  statuses: FieldStatuses,
  setSuggestion: (value: AiSuggestResponse | null) => void
) {
  if (!hasPendingFields(statuses)) {
    setSuggestion(null)
  }
}

export function useTaskAiSuggestions({
  enabled,
  open,
  values,
  onApplyField,
}: UseTaskAiSuggestionsParams) {
  const [fieldStatuses, setFieldStatuses] =
    useState<FieldStatuses>(INITIAL_FIELD_STATUSES)
  const [suggestion, setSuggestion] = useState<AiSuggestResponse | null>(null)
  const [drafts, setDrafts] = useState<DraftValues>({
    title: "",
    description: "",
  })
  const [loadingField, setLoadingField] =
    useState<AiSuggestionTriggerField | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const valuesRef = useRef(values)
  const requestIdRef = useRef(0)
  const wasActiveRef = useRef(false)

  useEffect(() => {
    valuesRef.current = values
  }, [values])

  const resetState = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    requestIdRef.current += 1

    setFieldStatuses(INITIAL_FIELD_STATUSES)
    setSuggestion(null)
    setDrafts({ title: "", description: "" })
    setLoadingField(null)
  }, [])

  useEffect(() => {
    const isActive = open && enabled

    if (wasActiveRef.current && !isActive) {
      resetState()
    }

    wasActiveRef.current = isActive
  }, [enabled, open, resetState])

  const fetchSuggestion = useCallback(
    async (triggerField: AiSuggestionTriggerField) => {
      const currentValues = valuesRef.current
      const payload = buildSuggestPayload(currentValues, triggerField)

      if (!payload) {
        setLoadingField(null)
        return
      }

      abortControllerRef.current?.abort()

      const controller = new AbortController()
      abortControllerRef.current = controller
      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId

      setLoadingField(triggerField)

      try {
        const result = await suggestTask(payload, controller.signal)

        if (requestId !== requestIdRef.current) {
          return
        }

        const latestValues = valuesRef.current
        const nextStatuses = resolvePendingStatuses(result, latestValues)

        if (!hasPendingFields(nextStatuses)) {
          setSuggestion(null)
          setFieldStatuses(INITIAL_FIELD_STATUSES)
          return
        }

        setDrafts({
          title: latestValues.title,
          description: latestValues.description,
        })
        setSuggestion(result)
        setFieldStatuses(nextStatuses)
      } catch {
        if (controller.signal.aborted) {
          return
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoadingField(null)
        }
      }
    },
    []
  )

  const scheduleFetch = useCallback(
    (triggerField: AiSuggestionTriggerField) => {
      if (!enabled) {
        return
      }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null
        void fetchSuggestion(triggerField)
      }, DEBOUNCE_MS)
    },
    [enabled, fetchSuggestion]
  )

  const handleFieldChange = useCallback(
    (field: AiSuggestionTriggerField, value: string) => {
      onApplyField(field, value)

      setFieldStatuses((current) => {
        if (current[field] !== "pending") {
          return current
        }

        const next = { ...current, [field]: "rejected" as const }
        clearSuggestionIfDone(next, setSuggestion)
        return next
      })

      scheduleFetch(field)
    },
    [onApplyField, scheduleFetch]
  )

  const acceptField = useCallback(
    (field: AiSuggestionField) => {
      if (!suggestion || fieldStatuses[field] !== "pending") {
        return
      }

      if (field === "title") {
        onApplyField("title", suggestion.title)
      } else if (field === "description") {
        onApplyField("description", suggestion.description)
      } else {
        onApplyField("priority", suggestion.priority)
      }

      setFieldStatuses((current) => {
        const next = { ...current, [field]: "accepted" as const }
        clearSuggestionIfDone(next, setSuggestion)
        return next
      })
    },
    [fieldStatuses, onApplyField, suggestion]
  )

  const rejectField = useCallback(
    (field: AiSuggestionField) => {
      if (fieldStatuses[field] !== "pending") {
        return
      }

      if (field === "title") {
        onApplyField("title", drafts.title)
      } else if (field === "description") {
        onApplyField("description", drafts.description)
      }

      setFieldStatuses((current) => {
        const next = { ...current, [field]: "rejected" as const }
        clearSuggestionIfDone(next, setSuggestion)
        return next
      })
    },
    [drafts.description, drafts.title, fieldStatuses, onApplyField]
  )

  const getDisplayValue = useCallback(
    (field: AiSuggestionTriggerField): string => {
      if (fieldStatuses[field] === "pending" && suggestion) {
        return suggestion[field]
      }

      return values[field]
    },
    [fieldStatuses, suggestion, values]
  )

  const getPriorityDisplay = useCallback((): TaskPriority => {
    if (fieldStatuses.priority === "pending" && suggestion) {
      return suggestion.priority
    }

    return values.priority
  }, [fieldStatuses.priority, suggestion, values.priority])

  const isFieldPending = useCallback(
    (field: AiSuggestionField): boolean => fieldStatuses[field] === "pending",
    [fieldStatuses]
  )

  const isFieldLoading = useCallback(
    (field: AiSuggestionTriggerField): boolean => loadingField === field,
    [loadingField]
  )

  return {
    getDisplayValue,
    getPriorityDisplay,
    fieldStatuses,
    handleFieldChange,
    acceptField,
    rejectField,
    isFieldPending,
    isFieldLoading,
  }
}
