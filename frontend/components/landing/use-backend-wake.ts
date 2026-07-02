"use client"

import { useCallback, useEffect, useState } from "react"

import { requestBackendHealthCheck } from "@/lib/api/health"

export type BackendWakeStatus = "idle" | "loading" | "success" | "error"

let hasAutoWoken = false

export function useBackendWake(autoWake = true) {
  const [status, setStatus] = useState<BackendWakeStatus>(
    autoWake ? "loading" : "idle",
  )

  const wake = useCallback(async () => {
    setStatus("loading")

    const isHealthy = await requestBackendHealthCheck()
    setStatus(isHealthy ? "success" : "error")
  }, [])

  useEffect(() => {
    if (!autoWake || hasAutoWoken) {
      return
    }

    hasAutoWoken = true
    void wake()
  }, [autoWake, wake])

  return {
    status,
    wake,
  }
}
