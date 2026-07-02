"use client"

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react"

import {
  PREVIEW_COLUMNS,
  useDashboardPreviewBoard,
} from "@/components/landing/use-dashboard-preview-board"

const easeOut = [0.22, 1, 0.36, 1] as const

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.38, ease: easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
}

type DashboardPreviewProps = {
  ready?: boolean
}

export function DashboardPreview({ ready = true }: DashboardPreviewProps) {
  const prefersReducedMotion = useReducedMotion()
  const animationsEnabled = prefersReducedMotion !== true

  const { cards, hasEntered, isAddingTask } = useDashboardPreviewBoard(
    animationsEnabled,
    ready,
  )

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Product Sprint</p>
            <p className="text-muted-foreground text-xs">Team workspace</p>
          </div>
          <motion.div
            className="bg-primary text-primary-foreground rounded-md px-2 py-1 text-xs font-medium"
            animate={
              animationsEnabled && isAddingTask
                ? { scale: [1, 0.94, 1.06, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            + New task
          </motion.div>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-3 p-4">
        {PREVIEW_COLUMNS.map((column) => (
          <div
            key={column.id}
            className="bg-muted/40 flex flex-col gap-2 rounded-lg p-2"
          >
            <p className="text-muted-foreground px-1 text-xs font-medium">
              {column.title}
            </p>

            <div className="flex flex-col gap-2">
              <AnimatePresence mode="popLayout" initial={false}>
                {cards
                  .filter((card) => card.columnId === column.id)
                  .map((card) => (
                    <motion.div
                      key={card.id}
                      layout={animationsEnabled}
                      layoutId={animationsEnabled ? card.id : undefined}
                      variants={animationsEnabled ? cardVariants : undefined}
                      initial={
                        animationsEnabled && hasEntered ? "hidden" : false
                      }
                      animate={animationsEnabled ? "visible" : false}
                      exit={animationsEnabled ? "exit" : undefined}
                      transition={{
                        layout: {
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        },
                      }}
                      className="bg-background outline-none rounded-md border px-2 py-2 text-xs shadow-xs"
                    >
                      {card.title}
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
