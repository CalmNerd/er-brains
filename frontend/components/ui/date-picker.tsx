"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon } from "@hugeicons/core-free-icons"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  DUE_DATE_PRESETS,
  formatCalendarDate,
  getPresetCalendarDate,
  parseCalendarDate,
  toCalendarDate,
} from "@/lib/dates/calendar-date"
import { cn } from "@/lib/utils"

type DatePickerProps = {
  value: string
  onChange: (value: string) => void
  className?: string
  triggerClassName?: string
  align?: "start" | "center" | "end"
  children?: React.ReactNode
}

export function DatePicker({
  value,
  onChange,
  className,
  triggerClassName,
  align = "start",
  children,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const selectedDate = React.useMemo(() => parseCalendarDate(value), [value])
  const [month, setMonth] = React.useState<Date>(selectedDate)

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setMonth(parseCalendarDate(value))
      }

      setOpen(nextOpen)
    },
    [value]
  )

  const handleSelect = React.useCallback(
    (date: Date | undefined) => {
      if (!date) return

      onChange(toCalendarDate(date))
      setOpen(false)
    },
    [onChange]
  )

  const handlePresetSelect = React.useCallback(
    (offsetDays: number) => {
      onChange(getPresetCalendarDate(offsetDays))
      setOpen(false)
    },
    [onChange]
  )

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        className={cn(
          "inline-flex h-7 w-full min-w-0 items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-2.5 text-left text-xs font-medium text-foreground transition-colors outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring",
          triggerClassName
        )}
        aria-label="Change due date"
      >
        {children ?? (
          <>
            <HugeiconsIcon
              icon={Calendar03Icon}
              strokeWidth={2}
              className="size-3.5 shrink-0"
            />
            <span className="truncate">{formatCalendarDate(value)}</span>
          </>
        )}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className={cn("w-auto max-w-[calc(100vw-2rem)] gap-0 p-0", className)}
      >
        <div className="flex flex-col sm:flex-row">
          <Calendar
            mode="single"
            selected={selectedDate}
            month={month}
            onMonthChange={setMonth}
            onSelect={handleSelect}
            className="order-1 p-2 sm:order-3 sm:p-3"
          />

          <Separator className="order-2 sm:hidden" />

          <Separator
            orientation="vertical"
            className="order-2 hidden sm:order-2 sm:block sm:h-auto"
          />

          <div className="order-3 flex flex-col gap-0.5 border-t p-2 sm:order-1 sm:w-28 sm:border-t-0 sm:p-3">
            {DUE_DATE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetSelect(preset.offsetDays)}
                className="rounded-md px-2 py-1 text-center text-[0.65rem] font-medium text-foreground transition-colors hover:bg-muted sm:px-0 sm:py-1 sm:text-xs"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
