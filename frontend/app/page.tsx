import { HeroHeader } from "@/components/header"
import { LandingHero } from "@/components/landing/hero"

export default function HomePage() {
  return (
    <>
      <HeroHeader />
      <main className="min-h-svh overflow-hidden">
        <LandingHero />
      </main>
    </>
  )
}
