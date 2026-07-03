const CALENDAR_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

/** Returns today's calendar date in the user's local timezone (YYYY-MM-DD). */
export function getLocalCalendarDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

/** Parses a YYYY-MM-DD string as local midnight (no UTC shift). */
export function parseCalendarDate(isoDate: string): Date {
  const match = CALENDAR_DATE_PATTERN.exec(isoDate)

  if (!match) {
    return new Date(isoDate)
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  return new Date(year, month - 1, day)
}

/** Formats a YYYY-MM-DD string for display in the user's local timezone. */
export function formatCalendarDate(isoDate: string): string {
  const date = parseCalendarDate(isoDate)
  const currentYear = new Date().getFullYear()

  if (date.getFullYear() === currentYear) {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  }

  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

/** Converts a local Date to a YYYY-MM-DD string. */
export function toCalendarDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export const DUE_DATE_PRESETS = [
  { label: "Today", offsetDays: 0 },
  { label: "Tomorrow", offsetDays: 1 },
  { label: "In 3 days", offsetDays: 3 },
  { label: "In a week", offsetDays: 7 },
] as const

/** Resolves a preset offset from today into a YYYY-MM-DD string. */
export function getPresetCalendarDate(offsetDays: number): string {
  const date = parseCalendarDate(getLocalCalendarDate())
  date.setDate(date.getDate() + offsetDays)

  return toCalendarDate(date)
}
