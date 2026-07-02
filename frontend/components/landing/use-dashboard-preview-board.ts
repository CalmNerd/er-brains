"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type PreviewColumnId = "todo" | "inProgress" | "done"

export type PreviewCard = {
  id: string
  title: string
  columnId: PreviewColumnId
}

export const PREVIEW_COLUMNS: { id: PreviewColumnId; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress" },
  { id: "done", title: "Done" },
]

const INITIAL_CARDS: PreviewCard[] = [
  { id: "card-1", title: "Fix login bug", columnId: "todo" },
  { id: "card-2", title: "Write API docs", columnId: "todo" },
  { id: "card-8", title: "Plan sprint retro", columnId: "todo" },
  { id: "card-9", title: "QA checkout flow", columnId: "todo" },
  { id: "card-3", title: "Design board view", columnId: "inProgress" },
  { id: "card-10", title: "Integrate webhooks", columnId: "inProgress" },
  { id: "card-4", title: "Set up auth", columnId: "done" },
  { id: "card-5", title: "Create teams", columnId: "done" },
  { id: "card-11", title: "Deploy staging", columnId: "done" },
]

type BoardStep =
  | { type: "pause"; durationMs: number }
  | { type: "add"; card: PreviewCard }
  | { type: "move"; cardId: string; toColumn: PreviewColumnId }
  | { type: "reset" }

const LOOP_STEPS: BoardStep[] = [
  { type: "pause", durationMs: 2200 },
  { type: "add", card: { id: "card-6", title: "Review PR", columnId: "todo" } },
  { type: "pause", durationMs: 1800 },
  { type: "move", cardId: "card-3", toColumn: "done" },
  { type: "pause", durationMs: 2000 },
  { type: "move", cardId: "card-1", toColumn: "inProgress" },
  { type: "pause", durationMs: 1800 },
  { type: "add", card: { id: "card-7", title: "Update roadmap", columnId: "todo" } },
  { type: "pause", durationMs: 2000 },
  { type: "move", cardId: "card-2", toColumn: "inProgress" },
  { type: "pause", durationMs: 2200 },
  { type: "reset" },
  { type: "pause", durationMs: 1200 },
]

const STEP_DELAY_MS = 900

export function useDashboardPreviewBoard(enabled: boolean, ready: boolean) {
  const [cards, setCards] = useState<PreviewCard[]>(INITIAL_CARDS)
  const [hasEntered, setHasEntered] = useState(false)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const stepIndexRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearScheduledStep = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const runStep = useCallback(() => {
    const step = LOOP_STEPS[stepIndexRef.current % LOOP_STEPS.length]
    stepIndexRef.current += 1

    switch (step.type) {
      case "pause":
        timeoutRef.current = setTimeout(runStep, step.durationMs)
        return

      case "add":
        setIsAddingTask(true)
        setCards((previous) => [...previous, step.card])
        timeoutRef.current = setTimeout(() => {
          setIsAddingTask(false)
          runStep()
        }, STEP_DELAY_MS)
        return

      case "move":
        setCards((previous) =>
          previous.map((card) =>
            card.id === step.cardId
              ? { ...card, columnId: step.toColumn }
              : card,
          ),
        )
        timeoutRef.current = setTimeout(() => runStep(), STEP_DELAY_MS)
        return

      case "reset":
        setCards(INITIAL_CARDS)
        timeoutRef.current = setTimeout(runStep, STEP_DELAY_MS)
        return
    }
  }, [])

  useEffect(() => {
    if (ready) {
      setHasEntered(true)
    }
  }, [ready])

  useEffect(() => {
    if (!enabled || !ready) {
      return
    }

    timeoutRef.current = setTimeout(runStep, 1600)

    return clearScheduledStep
  }, [clearScheduledStep, enabled, ready, runStep])

  return {
    cards,
    hasEntered,
    isAddingTask,
  }
}
