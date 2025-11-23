"use client"

import type React from "react"

import { useState } from "react"
import type { Task } from "./task-calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Sparkles } from "lucide-react"
import { format } from "date-fns"

type AddTaskModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (task: Omit<Task, "id" | "completed">) => void
}

export function AddTaskModal({ open, onOpenChange, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [importance, setImportance] = useState(5)
  const [estimatedTime, setEstimatedTime] = useState(30)
  const [dueDate, setDueDate] = useState<Date>()
  const [category, setCategory] = useState("Work")
  const [aiSuggesting, setAiSuggesting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      title,
      description,
      importance,
      estimatedTime,
      dueDate,
      category,
    })
    // Reset form
    setTitle("")
    setDescription("")
    setImportance(5)
    setEstimatedTime(30)
    setDueDate(undefined)
    setCategory("Work")
    onOpenChange(false)
  }

  const suggestImportance = () => {
    setAiSuggesting(true)
    // Simulate AI suggestion
    setTimeout(() => {
      const keywords = description.toLowerCase()
      let suggested = 5
      if (keywords.includes("urgent") || keywords.includes("asap")) suggested = 9
      else if (keywords.includes("important") || keywords.includes("critical")) suggested = 8
      else if (keywords.includes("meeting") || keywords.includes("deadline")) suggested = 7
      setImportance(suggested)
      setAiSuggesting(false)
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>Fill in the details below. AI will help prioritize your tasks.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add more details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Importance: {importance}/10</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={suggestImportance}
                disabled={!description || aiSuggesting}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                {aiSuggesting ? "Analyzing..." : "AI Suggest"}
              </Button>
            </div>
            <Slider
              value={[importance]}
              onValueChange={(value) => setImportance(value[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Estimated Time (min)</Label>
              <Input
                id="time"
                type="number"
                placeholder="30"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(Number(e.target.value))}
                min={5}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="School">School</SelectItem>
                  <SelectItem value="Errands">Errands</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!title} className="flex-1">
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
