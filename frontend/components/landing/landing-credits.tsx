"use client"

import { useEffect, useState } from "react"
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function LandingCredits() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <p className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs md:justify-start">
      <span>
        Built by{" "}
        <a
          href="https://x.com/calmnrd"
          target="_blank"
          rel="noreferrer"
          className="text-foreground hover:underline"
        >
          Mohit
        </a>
        . Source code on{" "}
        <a
          href="https://github.com/CalmNerd/er-brains"
          target="_blank"
          rel="noreferrer"
          className="text-foreground hover:underline"
        >
          GitHub
        </a>
        .
      </span>
      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="text-muted-foreground hover:text-foreground h-auto gap-1 px-1 py-0.5"
        aria-label="Toggle theme"
      >
        <HugeiconsIcon
          icon={isDark ? Sun01Icon : Moon02Icon}
          strokeWidth={2}
          className="size-3.5"
        />
        <span>Theme</span>
        <kbd className="border-border bg-muted text-muted-foreground rounded border px-1 py-px font-mono text-[10px] leading-none">
          D
        </kbd>
      </Button>
    </p>
  )
}
