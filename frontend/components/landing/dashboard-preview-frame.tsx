"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion, type Variants } from "motion/react"

import { DashboardPreview } from "@/components/landing/dashboard-preview"

const dropEase = [0.22, 1, 0.36, 1] as const

const stackVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
    },
  },
}

const backPaperVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 36,
    y: 20,
    rotateZ: 2,
    skewX: 4,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotateZ: 0,
    skewX: 6,
    transition: {
      duration: 0.85,
      ease: dropEase,
    },
  },
}

const frontPaperVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
    y: -28,
    rotateZ: 3,
    skewX: 4,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: -48,
    rotateZ: 0,
    skewX: 6,
    transition: {
      duration: 0.9,
      ease: dropEase,
    },
  },
}

export function DashboardPreviewFrame() {
  const prefersReducedMotion = useReducedMotion()
  const animationsEnabled = prefersReducedMotion !== true
  const [ready, setReady] = useState(!animationsEnabled)

  useEffect(() => {
    if (!animationsEnabled) {
      setReady(true)
    }
  }, [animationsEnabled])

  return (
    <motion.div
      className="relative h-full"
      style={{ transformOrigin: "100% 100%" }}
      variants={animationsEnabled ? stackVariants : undefined}
      initial={animationsEnabled ? "hidden" : false}
      animate={animationsEnabled ? "visible" : false}
      onAnimationComplete={() => {
        if (animationsEnabled) {
          setReady(true)
        }
      }}
    >
      <motion.div
        className={[
          "border-foreground/5 bg-foreground/5 pointer-events-none absolute -inset-x-4 bottom-7 top-0 rounded-[calc(var(--radius)+0.5rem)] border",
          !animationsEnabled ? "skew-x-6" : "",
        ].join(" ")}
        style={{ transformOrigin: "100% 100%" }}
        variants={animationsEnabled ? backPaperVariants : undefined}
      />

      <motion.div
        className={[
          "bg-background text-foreground shadow-foreground/10 ring-foreground/5 relative h-full min-h-[380px] overflow-hidden rounded-(--radius) border shadow-md ring-1",
          !animationsEnabled ? "-translate-y-12 skew-x-6" : "",
        ].join(" ")}
        style={{ transformOrigin: "100% 100%" }}
        variants={animationsEnabled ? frontPaperVariants : undefined}
      >
        <DashboardPreview ready={ready} />
      </motion.div>
    </motion.div>
  )
}
