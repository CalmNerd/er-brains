"use client"

import { useEffect, useRef } from "react"

import { Input } from "@/components/ui/input"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

import type { NavCollapsibleItem } from "@/components/nav-collapsible"

type NavCollapsibleItemRowProps = {
  item: NavCollapsibleItem
  isEditing: boolean
  onRename: (title: string) => void
  onCancelEdit: () => void
}

export function NavCollapsibleItemRow({
  item,
  isEditing,
  onRename,
  onCancelEdit,
}: NavCollapsibleItemRowProps) {
  const inputRef = useRef<HTMLInputElement>(null)

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
        <div className="flex h-8 items-center rounded-[calc(var(--radius-sm)+2px)] bg-sidebar-accent px-2 ring-sidebar-ring outline-hidden focus-within:ring-2">
          <Input
            ref={inputRef}
            defaultValue={item.title}
            placeholder="Team name"
            aria-label="Team name"
            className="h-6 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:border-transparent focus-visible:ring-0"
            onBlur={(event) => onRename(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                onRename(event.currentTarget.value)
              }

              if (event.key === "Escape") {
                event.preventDefault()
                onCancelEdit()
              }
            }}
          />
        </div>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<a href={item.url} />}
        isActive={item.isActive}
        className="hover:bg-sidebar-accent/80"
      >
        <span className="text-sm">{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
