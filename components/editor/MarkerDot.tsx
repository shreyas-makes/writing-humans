"use client"

import { useState } from "react"
import type { Editor } from "@tiptap/react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Suggestion } from "@/lib/types"
import { X } from "lucide-react"

interface MarkerDotProps {
  suggestion: Suggestion
  editor: Editor
  onDelete: () => void
}

export function MarkerDot({ suggestion, editor, onDelete }: MarkerDotProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getDaemonColor = (daemon: string) => {
    const colors: Record<string, string> = {
      "Devil's Advocate": "bg-indigo-500",
      Synthesizer: "bg-emerald-500",
      Complimenter: "bg-amber-500",
      Elaborator: "bg-sky-500",
      Researcher: "bg-rose-500",
    }
    return colors[daemon] || "bg-gray-500"
  }

  // Calculate position based on paragraph and offset
  const getPosition = () => {
    // This is a simplified approach - in a real app, you'd need more sophisticated positioning
    const paragraphs = editor.view.dom.querySelectorAll("p, h1, h2, h3, h4, h5, h6, blockquote")
    const paragraph = paragraphs[suggestion.paragraph_id]

    if (!paragraph) return { top: 0 }

    const rect = paragraph.getBoundingClientRect()
    const editorRect = editor.view.dom.getBoundingClientRect()

    return {
      top: rect.top - editorRect.top + window.scrollY,
    }
  }

  const position = getPosition()

  return (
    <div className="absolute left-2" style={{ top: `${position.top}px` }}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className={`h-3 w-3 rounded-full ${getDaemonColor(suggestion.daemon)} hover:opacity-80`}
            aria-label={`Suggestion from ${suggestion.daemon}`}
          />
        </PopoverTrigger>
        <PopoverContent className="w-80 ml-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge className={getDaemonColor(suggestion.daemon)}>{suggestion.daemon}</Badge>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onDelete}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm font-medium">Selected text:</p>
            <p className="text-sm italic bg-muted p-2 rounded">{suggestion.text}</p>
            <p className="text-sm font-medium">Suggestion:</p>
            <p className="text-sm">{suggestion.suggestion}</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
