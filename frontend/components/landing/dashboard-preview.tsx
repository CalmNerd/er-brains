export function DashboardPreview() {
  const columns = [
    {
      title: "To Do",
      cards: ["Fix login bug", "Write API docs"],
    },
    {
      title: "In Progress",
      cards: ["Design board view"],
    },
    {
      title: "Done",
      cards: ["Set up auth", "Create teams"],
    },
  ]

  return (
    <div className="bg-background text-foreground flex h-full min-h-[320px] flex-col overflow-hidden rounded-[calc(var(--radius))] border shadow-md">
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Product Sprint</p>
            <p className="text-muted-foreground text-xs">Team workspace</p>
          </div>
          <div className="bg-primary text-primary-foreground rounded-md px-2 py-1 text-xs font-medium">
            + New task
          </div>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-3 p-4">
        {columns.map((column) => (
          <div
            key={column.title}
            className="bg-muted/40 flex flex-col gap-2 rounded-lg p-2"
          >
            <p className="text-muted-foreground px-1 text-xs font-medium">
              {column.title}
            </p>
            {column.cards.map((card) => (
              <div
                key={card}
                className="bg-background rounded-md border px-2 py-2 text-xs shadow-xs"
              >
                {card}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
