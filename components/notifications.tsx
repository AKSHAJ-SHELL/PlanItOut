"use client"

import { useState } from "react"
import type { Task } from "./task-calendar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock } from "lucide-react"
import { format } from "date-fns"

type NotificationsProps = {
  tasks: Task[]
}

export function Notifications({ tasks }: NotificationsProps) {
  const [open, setOpen] = useState(false)

  const upcomingTasks = tasks.filter((task) => !task.completed && task.scheduledTime).slice(0, 5)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <Bell className="h-5 w-5" />
          {upcomingTasks.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {upcomingTasks.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Upcoming Tasks</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {upcomingTasks.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No upcoming tasks</div>
        ) : (
          upcomingTasks.map((task) => (
            <DropdownMenuItem key={task.id} className="flex flex-col items-start gap-1 p-3">
              <div className="font-medium text-sm">{task.title}</div>
              {task.scheduledTime && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {format(task.scheduledTime, "MMM d, h:mm a")}
                </div>
              )}
              <Badge variant="outline" className="text-xs mt-1">
                Priority: {task.importance}
              </Badge>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
