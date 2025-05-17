"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface DaemonPopoverProps {
  position: { x: number; y: number }
  selectedText: string
  onDaemonSelect: (daemon: string) => void
  onBookmark: () => void
  onDismiss: () => void
  activeDaemon: string | null
  suggestion: string | null
  isGenerating: boolean
}

const DAEMONS = [
  { name: "Devil's Advocate", color: "bg-indigo-500" },
  { name: "Synthesizer", color: "bg-emerald-500" },
  { name: "Complimenter", color: "bg-amber-500" },
  { name: "Elaborator", color: "bg-sky-500" },
  { name: "Researcher", color: "bg-rose-500" },
]

export function DaemonPopover({
  position,
  selectedText,
  onDaemonSelect,
  onBookmark,
  onDismiss,
  activeDaemon,
  suggestion,
  isGenerating,
}: DaemonPopoverProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    onDismiss()
  }

  const getDaemonColor = (daemon: string) => {
    // We will use a consistent style instead of daemon-specific colors for now.
    // return DAEMONS.find((d) => d.name === daemon)?.color || "bg-gray-500"
    return "bg-[#3B82F6] text-white" // Use soft blue for active daemon badge
  }

  return (
    <div
      className="absolute z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-0 w-0 p-0 m-0 border-none" />
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-white text-[#1F2937]">
          {!activeDaemon ? (
            <div className="space-y-2">
              <p className="text-sm font-medium mb-2">Choose a daemon:</p>
              <div className="flex flex-wrap gap-2">
                {DAEMONS.map((daemon) => (
                  <Badge
                    key={daemon.name}
                    className={`cursor-pointer bg-gray-200 text-[#1F2937] hover:bg-[#3B82F6] hover:text-white`}
                    onClick={() => onDaemonSelect(daemon.name)}
                  >
                    {daemon.name}
                  </Badge>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="mt-2 text-[#3B82F6] hover:bg-[#3B82F6]/10" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className={getDaemonColor(activeDaemon)}>{activeDaemon}</Badge>
                {isGenerating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>

              {suggestion ? (
                <>
                  <p className="text-sm">{suggestion}</p>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm" className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/10" onClick={handleClose}>
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white"
                      onClick={() => {
                        onBookmark()
                        handleClose()
                      }}
                    >
                      Bookmark
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Generating suggestion...</p>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
