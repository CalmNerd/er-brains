"use client"

import { useRouter } from "next/navigation"
import { ArrowRightIcon, Play } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  const router = useRouter()

  return (
    <section
      id="features"
      className="bg-linear-to-b to-muted from-background min-h-svh"
    >
      <div className="relative flex min-h-svh items-center pt-16 pb-12">
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
          <div className="md:w-1/2">
            <div>
              <h1 className="max-w-md text-balance text-5xl font-medium md:text-6xl">
                Task management for modern teams
              </h1>
              <p className="text-muted-foreground my-8 max-w-2xl text-balance text-xl">
                Plan, prioritize, and ship work. From kanban boards to AI-powered
                task suggestions, all in one workspace.
              </p>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  size="lg"
                  className="pr-4.5"
                  onClick={() => router.push("/signup")}
                >
                  <span className="text-nowrap">Get Started</span>
                  <HugeiconsIcon
                    icon={ArrowRightIcon}
                    strokeWidth={2}
                    className="size-3.5"
                  />
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="pl-5"
                  onClick={() => router.push("/dashboard")}
                >
                  <HugeiconsIcon icon={Play} strokeWidth={2} className="size-3.5" />
                  <span className="text-nowrap">View demo</span>
                </Button>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-muted-foreground">Trusted by teams at:</p>
              <div className="**:fill-foreground mt-6 flex items-center gap-8">
                <span>Me</span>
                <span>My Friends</span>
                <span>You (maybe)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="perspective-near mt-24 hidden translate-x-12 md:absolute md:-right-6 md:bottom-16 md:left-1/2 md:top-40 md:mt-0 md:block md:translate-x-0">
          <div className="before:border-foreground/5 before:bg-foreground/5 relative h-full before:absolute before:-inset-x-4 before:bottom-7 before:top-0 before:skew-x-6 before:rounded-[calc(var(--radius)+0.5rem)] before:border">
            <div className="bg-background rounded-(--radius) shadow-foreground/10 ring-foreground/5 relative h-full -translate-y-12 skew-x-6 overflow-hidden border border-transparent shadow-md ring-1">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
