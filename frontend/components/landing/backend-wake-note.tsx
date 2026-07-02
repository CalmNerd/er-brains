"use client"

import {
  Cancel01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useBackendWake } from "@/components/landing/use-backend-wake"
import { Button } from "@/components/ui/button"

export function BackendWakeNote() {
  const { status, wake } = useBackendWake(true)
  const isVisible = status !== "success"

  return (
    <div className="flex h-12 sm:h-6 w-full items-center">
      {isVisible ? (
        <p className="text-muted-foreground flex flex-wrap items-center tracking-tight leading-tight gap-x-1 text-left text-xs">
          Free Render tier, tap
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="shrink-0"
            onClick={() => void wake()}
            disabled={status === "loading"}
            aria-label={
              status === "loading" ? "Checking backend" : "Wake backend"
            }
          >
            {status === "loading" ? (
              <HugeiconsIcon
                icon={Loading03Icon}
                strokeWidth={2}
                className="text-muted-foreground size-3.5 animate-spin"
              />
            ) : (
              <HugeiconsIcon
                icon={Cancel01Icon}
                strokeWidth={2}
                className="text-muted-foreground size-3.5"
              />
            )}
          </Button>
          to wake up or
          <a
            href="https://github.com/sponsors/CalmNerd"
            target="_blank"
            rel="noreferrer"
            className="text-foreground hover:underline"
          >
            sponsor
          </a>
          to keep awake.
        </p>
      ) : null}
    </div>
  )
}
