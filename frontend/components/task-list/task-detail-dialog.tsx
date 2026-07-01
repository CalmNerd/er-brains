"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatTaskId } from "@/lib/tasks/utils"
import { TASK_PRIORITIES, TASK_STATUSES, type Task } from "@/lib/tasks/types"

import { cn } from "@/lib/utils"

type TaskDetailDialogProps = {
  task: Task
  triggerVariant?: "list" | "board"
}

const TRIGGER_STYLES = {
  list: "min-w-0 flex-1 truncate text-left text-sm text-foreground hover:underline",
  board: "min-w-0 flex-1 line-clamp-1 text-left text-sm font-medium text-foreground hover:text-primary",
} as const

/** Prevents the row drag handler from starting when opening task details. */
function stopDragPointerDown(event: React.PointerEvent) {
  event.stopPropagation()
}

export function TaskDetailDialog({
  task,
  triggerVariant = "list",
}: TaskDetailDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            onPointerDown={stopDragPointerDown}
            className={cn(TRIGGER_STYLES[triggerVariant])}
          />
        }
      >
        {task.title}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader className="gap-1">
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>{formatTaskId(task.id)}</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`title-${task.id}`}>Title</Label>
            <Input id={`title-${task.id}`} defaultValue={task.title} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`description-${task.id}`}>Description</Label>
            <textarea
              id={`description-${task.id}`}
              defaultValue={task.description}
              rows={4}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`due-${task.id}`}>Due date</Label>
              <Input
                id={`due-${task.id}`}
                type="date"
                defaultValue={task.dueDate}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`priority-${task.id}`}>Priority</Label>
              <Select defaultValue={task.priority}>
                <SelectTrigger id={`priority-${task.id}`} className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {TASK_PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`status-${task.id}`}>Status</Label>
            <Select defaultValue={task.status}>
              <SelectTrigger id={`status-${task.id}`} className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                    {TASK_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button type="button">Save</Button>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
