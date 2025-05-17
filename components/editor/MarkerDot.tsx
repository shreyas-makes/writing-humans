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
    // Use soft blue for consistency instead of daemon-specific colors
    return "bg-[#3B82F6] text-white"
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
          {/* Style marker dot with soft blue */}
          <button
            className={`h-3 w-3 rounded-full bg-[#3B82F6] hover:opacity-80`}
            aria-label={`Suggestion from ${suggestion.daemon}`}
          />
        </PopoverTrigger>
        {/* Apply light gray background and dark gray text to popover content */}
        <PopoverContent className="w-80 ml-6 bg-[#F9FAFB] text-[#1F2937]">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {/* Daemon badge uses soft blue */} {/* Applied via getDaemonColor */}
              <Badge className={getDaemonColor(suggestion.daemon)}>{suggestion.daemon}</Badge>
              {/* Style delete button with subtle red icon */} {/* Use a neutral background/hover */} 
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-300" onClick={onDelete}>
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <p className="text-sm font-medium">Selected text:</p>
            <p className="text-sm italic bg-gray-200 p-2 rounded">{suggestion.text}</p>
            <p className="text-sm font-medium">Suggestion:</p>
            <p className="text-sm">{suggestion.suggestion}</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
