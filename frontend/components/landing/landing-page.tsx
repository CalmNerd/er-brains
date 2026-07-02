"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { HeroHeader } from "@/components/header"
import { LandingHero } from "@/components/landing/hero"
import { getAuthToken } from "@/lib/auth/storage"

export function LandingPage() {
  const router = useRouter()
  const [canShowLanding, setCanShowLanding] = useState(false)

  useEffect(() => {
    if (getAuthToken()) {
      router.replace("/dashboard")
      return
    }

    setCanShowLanding(true)
  }, [router])

  if (!canShowLanding) {
    return <div className="min-h-svh bg-background" />
  }

  return (
    <>
      <HeroHeader />
      <main className="min-h-svh overflow-hidden">
        <LandingHero />
      </main>
    </>
  )
}
