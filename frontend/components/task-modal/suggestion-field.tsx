"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

import { TextField } from "@/components/task-modal/text-field"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SuggestionFieldProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  multiline?: boolean
  autoFocus?: boolean
  inputClassName?: string
  isPending?: boolean
  isLoading?: boolean
  onAccept?: () => void
  onReject?: () => void
}

function SuggestionFieldActions({
  onAccept,
  onReject,
  className,
}: {
  onAccept: () => void
  onReject: () => void
  className?: string
}) {
  return (
    <div className={cn("flex shrink-0 items-center gap-0.5", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Accept suggestion"
        className="size-5 text-muted-foreground hover:text-foreground"
        onMouseDown={(event) => event.preventDefault()}
        onClick={onAccept}
      >
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Reject suggestion"
        className="size-5 text-muted-foreground hover:text-destructive"
        onMouseDown={(event) => event.preventDefault()}
        onClick={onReject}
      >
        <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3" />
      </Button>
    </div>
  )
}

export function SuggestionField({
  value,
  onChange,
  placeholder,
  multiline = false,
  autoFocus = false,
  inputClassName,
  isPending = false,
  isLoading = false,
  onAccept,
  onReject,
}: SuggestionFieldProps) {
  const lineHeightClassName = cn(inputClassName)

  return (
    <div className="flex min-w-0 items-start gap-2">
      <div
        className={cn("relative min-w-0 flex-1", lineHeightClassName)}
      >
        <TextField
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          multiline={multiline}
          autoFocus={autoFocus}
          inputClassName={cn(
            inputClassName,
            isPending && "text-muted-foreground"
          )}
        />
        {isLoading ? (
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 flex h-[1lh] items-center"
          >
            <span className="size-3 animate-pulse rounded-full bg-muted-foreground/40" />
          </div>
        ) : null}
      </div>

      {isPending && onAccept && onReject ? (
        <SuggestionFieldActions
          onAccept={onAccept}
          onReject={onReject}
          className={cn("h-[1lh] items-center", lineHeightClassName)}
        />
      ) : null}
    </div>
  )
}

export { SuggestionFieldActions }
