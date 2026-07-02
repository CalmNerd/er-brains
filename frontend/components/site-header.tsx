"use client"

import { useTeamNav } from "@/hooks/use-team-nav"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export function SiteHeader() {
  const { teams, selectedTeamId, isLoading, isResolvingTeam } = useTeamNav()

  const activeTeamName =
    teams.find((team) => team.id === selectedTeamId)?.name ?? "Team"
  const isLoadingTeam = isLoading || isResolvingTeam

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        {isLoadingTeam ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          <h1 className="truncate text-base font-medium">{activeTeamName}</h1>
        )}
      </div>
    </header>
  )
}
