"use client"

import { ComponentProps } from "react"

import {
  NavCollapsible,
  type NavCollapsibleGroup,
} from "@/components/nav-collapsible"
import { useNavTeams } from "@/hooks/use-nav-teams"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const NavMain: NavCollapsibleGroup[] = [
  {
    title: "Your Teams",
    url: "#",
    items: [
      { id: "team-1", title: "Team 1", url: "#", isActive: true },
      { id: "team-2", title: "Team 2", url: "#" },
      { id: "team-3", title: "Team 3", url: "#" },
    ],
  },
]

const user = {
  name: "ER Brains",
  email: "m@example.com",
  avatar: "/assets/logo.png",
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const {
    groups,
    editingItemId,
    addTeam,
    renameTeam,
    cancelEdit,
    startEditTeam,
    deleteTeam,
  } = useNavTeams(NavMain)

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <Avatar>
                <AvatarImage src="/assets/logo.png" />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <span className="text-base font-semibold">ER Brains</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavCollapsible
          items={groups}
          editingItemId={editingItemId}
          onAddItem={addTeam}
          onRenameItem={renameTeam}
          onCancelEdit={cancelEdit}
          onStartEditItem={(_, itemId) => startEditTeam(itemId)}
          onDeleteItem={deleteTeam}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
