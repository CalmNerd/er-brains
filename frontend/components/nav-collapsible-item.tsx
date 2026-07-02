"use client"

import { useEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, Edit02Icon, Tick02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarMenuItem } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

import type { NavCollapsibleItem } from "@/components/nav-collapsible"

type NavCollapsibleItemRowProps = {
  item: NavCollapsibleItem
  isEditing: boolean
  onRename: (title: string) => void
  onCancelEdit: () => void
  onStartEdit: () => void
  onDelete: () => void
}

export function NavCollapsibleItemRow({
  item,
  isEditing,
  onRename,
  onCancelEdit,
  onStartEdit,
  onDelete,
}: NavCollapsibleItemRowProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const commitRename = () => {
    onRename(inputRef.current?.value ?? "")
  }

  useEffect(() => {
    if (!isEditing) {
      return
    }

    inputRef.current?.focus()
    inputRef.current?.select()
  }, [isEditing])

  if (isEditing) {
    return (
      <SidebarMenuItem>
        <div className="mb-[1px] flex h-8 items-center gap-0.5 rounded-md bg-sidebar-accent px-2 ring-sidebar-ring outline-hidden focus-within:ring-2">
          <Input
            ref={inputRef}
            defaultValue={item.title}
            placeholder="Team name"
            aria-label="Team name"
            className="h-6 min-w-0 flex-1 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:border-transparent focus-visible:ring-0"
            onBlur={(event) => onRename(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                commitRename()
              }

              if (event.key === "Escape") {
                event.preventDefault()
                onCancelEdit()
              }
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Save team name"
            className="size-5 shrink-0 lg:hidden"
            onMouseDown={(event) => event.preventDefault()}
            onClick={commitRename}
          >
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3.5" />
          </Button>
        </div>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <div
        className={cn(
          "group/item mb-[1px] flex h-8 items-center gap-0.5 rounded-md px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          item.isActive &&
            "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
        )}
      >
        <a
          href={item.url}
          className="flex min-w-0 flex-1 items-center truncate text-sm outline-hidden focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          {item.title}
        </a>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`Edit ${item.title}`}
          className="size-5 shrink-0 md:opacity-0 md:transition-opacity md:group-hover/item:opacity-100"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onStartEdit()
          }}
        >
          <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="size-3.5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`Delete ${item.title}`}
          className="size-5 shrink-0 text-muted-foreground hover:text-destructive md:opacity-0 md:transition-opacity md:group-hover/item:opacity-100"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onDelete()
          }}
        >
          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3.5" />
        </Button>
      </div>
    </SidebarMenuItem>
  )
}
