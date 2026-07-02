"use client"

import { motion, useReducedMotion } from "motion/react"

import {
  getLogoSrc,
  LOGO_CLOUD_CELL_COUNT,
  LOGO_CLOUD_LOGOS,
} from "@/components/landing/logo-cloud/logos"
import { useLogoCloud } from "@/components/landing/logo-cloud/use-logo-cloud"
import { cn } from "@/lib/utils"
import Image from "next/image"

type LogoCloudProps = {
  title?: string
  className?: string
}

function LogoCloudCell({
  isBlurring,
  logoName,
  logoSrc,
  fadeDurationMs,
}: {
  isBlurring: boolean
  logoName: string
  logoSrc: string
  fadeDurationMs: number
}) {
  return (
    <div className="flex size-14 items-center justify-center overflow-hidden">
      <motion.div
        className="flex size-full items-center justify-center"
        animate={{
          opacity: isBlurring ? 0 : 0.7,
          filter: isBlurring ? "blur(8px)" : "blur(0px)",
        }}
        transition={{ duration: fadeDurationMs / 1000, ease: "easeInOut" }}
      >
        <span className="sr-only">{logoName}</span>
        <Image
          src={logoSrc}
          alt={logoName}
          width={56}
          height={56}
          className="max-h-6 w-auto max-w-full object-contain dark:invert"
          priority
        />
      </motion.div>
    </div>
  )
}

export function LogoCloud({
  title = "Trusted by people at:",
  className,
}: LogoCloudProps) {
  const prefersReducedMotion = useReducedMotion()
  const animationsEnabled = prefersReducedMotion !== true
  const { blurringCell, displayed, fadeDurationMs } =
    useLogoCloud(animationsEnabled)

  return (
    <div className={cn("w-full", className)}>
      <p className="text-muted-foreground text-sm">{title}</p>

      <div
        className="mx-auto grid w-fit grid-cols-4 justify-items-start md:mx-0"
        aria-label="Company logos"
      >
        {Array.from({ length: LOGO_CLOUD_CELL_COUNT }, (_, cellIndex) => {
          const logoIndex =
            displayed[cellIndex] ?? cellIndex % LOGO_CLOUD_LOGOS.length
          const logo = LOGO_CLOUD_LOGOS[logoIndex]

          return (
            <LogoCloudCell
              key={cellIndex}
              isBlurring={blurringCell === cellIndex}
              logoName={logo.name}
              logoSrc={getLogoSrc(logo.src)}
              fadeDurationMs={fadeDurationMs}
            />
          )
        })}
      </div>
    </div>
  )
}
