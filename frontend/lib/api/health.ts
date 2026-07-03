import { API_BASE_URL } from "@/lib/api/config"

const HEALTH_CHECK_TIMEOUT_MS = 90_000

type HealthResponse = {
  status?: string
}

export async function pingBackendHealth(): Promise<boolean> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE_URL}/api/ping`, {
      signal: controller.signal,
      cache: "no-store",
    })

    if (!response.ok) {
      return false
    }

    const body = (await response.json()) as HealthResponse
    return body.status === "ok"
  } catch {
    return false
  } finally {
    clearTimeout(timeoutId)
  }
}

let inFlightHealthCheck: Promise<boolean> | null = null

export function requestBackendHealthCheck(): Promise<boolean> {
  if (inFlightHealthCheck) {
    return inFlightHealthCheck
  }

  inFlightHealthCheck = pingBackendHealth().finally(() => {
    inFlightHealthCheck = null
  })

  return inFlightHealthCheck
}
