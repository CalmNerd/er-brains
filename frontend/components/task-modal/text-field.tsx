"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type NotionTextFieldProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  multiline?: boolean
  className?: string
  inputClassName?: string
  autoFocus?: boolean
}

export function NotionTextField({
  value,
  onChange,
  placeholder,
  multiline = false,
  className,
  inputClassName,
  autoFocus = false,
}: NotionTextFieldProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const resizeTextarea = React.useCallback(() => {
    const element = textareaRef.current
    if (!element) return

    element.style.height = "auto"
    element.style.height = `${element.scrollHeight}px`
  }, [])

  React.useEffect(() => {
    if (multiline) {
      resizeTextarea()
    }
  }, [multiline, resizeTextarea, value])

  if (multiline) {
    return (
      <div className={cn("w-full", className)}>
        <textarea
          ref={textareaRef}
          value={value}
          autoFocus={autoFocus}
          placeholder={placeholder}
          rows={1}
          onChange={(event) => {
            onChange(event.target.value)
            resizeTextarea()
          }}
          className={cn(
            "placeholder:text-muted-foreground/70 w-full resize-none border-0 bg-transparent p-0 shadow-none outline-none focus:ring-0",
            inputClassName
          )}
        />
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      <input
        type="text"
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "placeholder:text-muted-foreground/70 w-full border-0 bg-transparent p-0 shadow-none outline-none focus:ring-0",
          inputClassName
        )}
      />
    </div>
  )
}
