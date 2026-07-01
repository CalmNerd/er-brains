"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { NavCollapsibleItemRow } from "@/components/nav-collapsible-item"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, Plus } from "@hugeicons/core-free-icons"
import { Button } from "./ui/button"

export type NavCollapsibleItem = {
  id: string
  title: string
  url: string
  isActive?: boolean
  isDraft?: boolean
}

export type NavCollapsibleGroup = {
  title: string
  url: string
  items: NavCollapsibleItem[]
}

type NavCollapsibleProps = {
  items: NavCollapsibleGroup[]
  editingItemId?: string | null
  onAddItem?: (groupTitle: string) => void
  onRenameItem?: (groupTitle: string, itemId: string, title: string) => void
  onCancelEdit?: (groupTitle: string, itemId: string) => void
}

export function NavCollapsible({
  items,
  editingItemId = null,
  onAddItem,
  onRenameItem,
  onCancelEdit,
}: NavCollapsibleProps) {
  return (
    <>
      {items.map((group) => (
        <Collapsible
          key={group.title}
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <div className="group/label mb-[1px] flex h-8 items-center gap-0.5 rounded-md px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <SidebarGroupLabel
                render={<CollapsibleTrigger />}
                className="flex min-w-0 flex-1 cursor-pointer items-center bg-transparent px-0 text-inherit hover:bg-transparent"
              >
                <span className="text-xs">{group.title}</span>
              </SidebarGroupLabel>
              {onAddItem && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Add ${group.title.toLowerCase()}`}
                  className="size-5 shrink-0 md:opacity-0 transition-opacity md:group-hover/label:opacity-100"
                  onClick={() => onAddItem(group.title)}
                >
                  <HugeiconsIcon className="size-4" icon={Plus} strokeWidth={2} />
                </Button>
              )}
              <CollapsibleTrigger className="flex size-5 shrink-0 items-center justify-center rounded-md outline-hidden focus-visible:ring-2 focus-visible:ring-sidebar-ring">
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className="size-4 transition-transform group-data-[open]/collapsible:rotate-90"
                />
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <NavCollapsibleItemRow
                      key={item.id}
                      item={item}
                      isEditing={editingItemId === item.id}
                      onRename={(title) => onRenameItem?.(group.title, item.id, title)}
                      onCancelEdit={() => onCancelEdit?.(group.title, item.id)}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      ))}
    </>
  )
}
