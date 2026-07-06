"use client"

import { useRouter } from "next/navigation"
import { ArrowRightIcon, Play } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { BackendWakeNote } from "@/components/landing/backend-wake-note"
import { DashboardPreviewFrame } from "@/components/landing/dashboard-preview-frame"
import { LandingCredits } from "@/components/landing/landing-credits"
import { LogoCloud } from "@/components/landing/logo-cloud/logo-cloud"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  const router = useRouter()

  return (
    <section
      id="features"
      className="bg-linear-to-b to-muted from-background min-h-svh"
    >
      <div className="relative flex min-h-svh flex-col pt-16 pb-8 md:pb-12">
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 lg:justify-center">
          <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center text-center md:mx-0 md:max-w-none md:w-1/2 md:items-start md:text-left lg:flex-none">
            <div className="flex w-full flex-1 flex-col lg:flex-none">
              <div className="flex flex-1 items-center lg:block lg:flex-none">
                <div className="w-full">
                  <h1 className="mx-auto max-w-md text-3xl md:text-balance font-medium md:mx-0 md:text-5xl md:text-6xl">
                    Task management for modern teams
                  </h1>
                  <p className="text-muted-foreground md:text-balance my-8 max-w-2xl text-base md:text-xl">
                    Plan, prioritize, and ship work. From kanban boards to
                    AI-powered task suggestions, all in one workspace.
                  </p>

                  <div className="flex items-center justify-center gap-3 md:justify-start">
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
                      onClick={() =>
                        window.open(
                          "https://youtu.be/Fy5Hk0adtsw",
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      <HugeiconsIcon icon={Play} strokeWidth={2} className="size-3.5" />
                      <span className="text-nowrap">View demo</span>
                    </Button>
                  </div>

                  <LogoCloud className="mt-10" />
                </div>
              </div>

              <div className="w-full md:pt-16">
                <BackendWakeNote />
                <LandingCredits />
              </div>
            </div>
          </div>
        </div>

        <div className="perspective-near mt-24 hidden translate-x-12 md:absolute md:-right-6 md:bottom-16 md:left-1/2 md:top-40 md:mt-0 md:block md:translate-x-0">
          <DashboardPreviewFrame />
        </div>
      </div>
    </section>
  )
}
