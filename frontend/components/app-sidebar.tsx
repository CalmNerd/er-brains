"use client"

import { useRouter } from "next/navigation"
import { ComponentProps } from "react"

import { AppSidebarTeamsSkeleton } from "@/components/app-sidebar-teams-skeleton"
import {
  NavCollapsible,
} from "@/components/nav-collapsible"
import { useCurrentUser } from "@/hooks/queries/use-current-user"
import { useTeamNav } from "@/hooks/use-team-nav"
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
import { logout } from "@/lib/auth/clear-app-state"
import Image from "next/image"

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const { user } = useCurrentUser()

  const {
    groups,
    isLoading,
    isError,
    refetch,
    editingTeamId,
    addTeam,
    renameTeam,
    cancelEdit,
    startEditTeam,
    deleteTeam,
    selectTeam,
  } = useTeamNav()

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="/dashboard" />}
            >
              <Image src="/assets/erbrains-logo.png" alt="ER Brains" width={100} height={100} className="mx-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isLoading ? (
          <AppSidebarTeamsSkeleton />
        ) : isError ? (
          <div className="space-y-2 px-4 py-2 text-xs">
            <p className="text-muted-foreground">Unable to load teams.</p>
            <button
              type="button"
              className="text-foreground underline underline-offset-4"
              onClick={() => void refetch()}
            >
              Try again
            </button>
          </div>
        ) : (
          <NavCollapsible
            items={groups}
            editingItemId={editingTeamId}
            onAddItem={() => addTeam()}
            onSelectItem={(_, itemId) => selectTeam(itemId)}
            onRenameItem={renameTeam}
            onCancelEdit={cancelEdit}
            onStartEditItem={(_, itemId) => startEditTeam(itemId)}
            onDeleteItem={deleteTeam}
          />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name ?? "User",
            email: user?.email ?? "",
            avatar: "/assets/logo.png",
          }}
          onLogout={handleLogout}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
