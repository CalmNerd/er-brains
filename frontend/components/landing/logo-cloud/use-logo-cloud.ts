"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import {
  LOGO_CLOUD_CELL_COUNT,
  LOGO_CLOUD_LOGOS,
} from "@/components/landing/logo-cloud/logos"

const TICK_INTERVAL_MS = 4000
const FADE_DURATION_MS = 500

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled
}

function createInitialDisplay(): number[] {
  return Array.from(
    { length: LOGO_CLOUD_CELL_COUNT },
    (_, index) => index % LOGO_CLOUD_LOGOS.length,
  )
}

export function useLogoCloud(enabled: boolean) {
  const [displayed, setDisplayed] = useState<number[]>(createInitialDisplay)
  const [blurringCell, setBlurringCell] = useState<number | null>(null)

  const displayedRef = useRef(displayed)
  const logoQueueRef = useRef<number[]>([])
  const cellQueueRef = useRef<number[]>([])
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    displayedRef.current = displayed
  }, [displayed])

  const refillLogoQueue = useCallback(() => {
    logoQueueRef.current = shuffle(
      Array.from({ length: LOGO_CLOUD_LOGOS.length }, (_, index) => index),
    )
  }, [])

  const refillCellQueue = useCallback(() => {
    cellQueueRef.current = shuffle(
      Array.from({ length: LOGO_CLOUD_CELL_COUNT }, (_, index) => index),
    )
  }, [])

  const nextLogoFor = useCallback((cellIndex: number) => {
    if (logoQueueRef.current.length === 0) {
      refillLogoQueue()
    }

    const currentLogo = displayedRef.current[cellIndex]

    if (
      logoQueueRef.current[0] === currentLogo &&
      logoQueueRef.current.length > 1
    ) {
      const swapIndex = logoQueueRef.current.findIndex(
        (logoIndex, index) => index > 0 && logoIndex !== currentLogo,
      )

      if (swapIndex !== -1) {
        ;[logoQueueRef.current[0], logoQueueRef.current[swapIndex]] = [
          logoQueueRef.current[swapIndex],
          logoQueueRef.current[0],
        ]
      }
    }

    return logoQueueRef.current.shift() ?? 0
  }, [refillLogoQueue])

  const tick = useCallback(() => {
    if (cellQueueRef.current.length === 0) {
      refillCellQueue()
    }

    const cellIndex = cellQueueRef.current.shift()
    if (cellIndex === undefined) {
      return
    }

    const nextLogoIndex = nextLogoFor(cellIndex)

    setBlurringCell(cellIndex)

    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current)
    }

    fadeTimeoutRef.current = setTimeout(() => {
      setDisplayed((previous) => {
        const next = [...previous]
        next[cellIndex] = nextLogoIndex
        return next
      })
      setBlurringCell(null)
    }, FADE_DURATION_MS)
  }, [nextLogoFor, refillCellQueue])

  useEffect(() => {
    if (!enabled) {
      return
    }

    tickIntervalRef.current = setInterval(tick, TICK_INTERVAL_MS)

    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current)
      }

      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current)
      }
    }
  }, [enabled, tick])

  return {
    blurringCell,
    displayed,
    fadeDurationMs: FADE_DURATION_MS,
  }
}
