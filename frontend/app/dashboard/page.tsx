import { AppSidebar } from "@/components/app-sidebar"
import { TaskList } from "@/components/task-list/task-list"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { tasksSchema } from "@/lib/tasks/schema"

import data from "./data.json"

const tasks = tasksSchema.parse(data)

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
              <TaskList data={tasks} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
