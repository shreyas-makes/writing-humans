"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { useCallback, useEffect, useState } from "react"
import { extensions } from "./tiptap-extensions"
import { DaemonPopover } from "./daemon-popover"
import { CommandMenu } from "./CommandMenu"
import { MarkerDot } from "./marker-dot"
import { getSupabaseClient } from "@/lib/supabase-client"
import { generateDaemonSuggestion } from "@/lib/ai/daemons"
import type { Suggestion } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface EditorProps {
  initialContent: string
  onUpdate: (content: string) => void
  documentId: string
}

export function Editor({ initialContent, onUpdate, documentId }: EditorProps) {
  const supabase = getSupabaseClient()
  const { toast } = useToast()
  const [selectedText, setSelectedText] = useState("")
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null)
  const [showDaemonPopover, setShowDaemonPopover] = useState(false)
  const [showCommandMenu, setShowCommandMenu] = useState(false)
  const [commandMenuPosition, setCommandMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [bookmarkedSuggestions, setBookmarkedSuggestions] = useState<Suggestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeDaemon, setActiveDaemon] = useState<string | null>(null)
  const [currentSuggestion, setCurrentSuggestion] = useState<string | null>(null)

  const editor = useEditor({
    extensions,
    content: initialContent || "<p>Start writing here...</p>",
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML())
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection
      if (from === to) {
        setSelectedText("")
        setSelectionPosition(null)
        return
      }

      const text = editor.state.doc.textBetween(from, to)
      if (text && text.length > 0) {
        setSelectedText(text)

        // Get position for the popover
        const view = editor.view
        const domResult = view.domAtPos(from)
        if (!domResult || !domResult.node || !(domResult.node instanceof Element)) {
          setSelectionPosition(null)
          return
        }

        const nodeRect = domResult.node.getBoundingClientRect()
        if (!nodeRect) {
          setSelectionPosition(null)
          return
        }

        setSelectionPosition({
          x: nodeRect.left,
          y: nodeRect.top - 40, // Position above the selection
        })
      } else {
        setSelectedText("")
        setSelectionPosition(null)
      }
    },
  })

  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle slash command
      if (event.key === "/" && !showCommandMenu) {
        const { from } = editor.state.selection
        const view = editor.view
        // Use coordsAtPos for more precise positioning relative to the caret
        const coords = view.coordsAtPos(from)

        setCommandMenuPosition({
          x: coords.left,
          y: coords.bottom, // Position it below the caret
        })
        setShowCommandMenu(true)
        event.preventDefault()
      }

      // Handle CMD+K for daemon popover
      if ((event.metaKey || event.ctrlKey) && event.key === "k" && selectedText) {
        event.preventDefault()
        setShowDaemonPopover(true)
      }
    }

    editor.view.dom.addEventListener("keydown", handleKeyDown)

    return () => {
      editor.view.dom.removeEventListener("keydown", handleKeyDown)
    }
  }, [editor, showCommandMenu, selectedText])

  useEffect(() => {
    const fetchBookmarkedSuggestions = async () => {
      if (!documentId) return

      const { data, error } = await supabase
        .from("suggestions")
        .select("*")
        .eq("document_id", documentId)
        .eq("bookmarked", true)

      if (error) {
        console.error("Error fetching bookmarked suggestions:", error)
        return
      }

      setBookmarkedSuggestions(data || [])
    }

    fetchBookmarkedSuggestions()
  }, [documentId, supabase])

  const handleDaemonSelect = useCallback(
    async (daemon: string) => {
      if (!selectedText || isGenerating) return

      setActiveDaemon(daemon)
      setIsGenerating(true)

      try {
        const suggestion = await generateDaemonSuggestion(daemon, selectedText)
        setCurrentSuggestion(suggestion)
      } catch (error) {
        toast({
          title: "Error generating suggestion",
          description: "Failed to generate a suggestion. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsGenerating(false)
      }
    },
    [selectedText, toast],
  )

  const handleBookmarkSuggestion = useCallback(async () => {
    if (!documentId || !activeDaemon || !currentSuggestion || !selectedText || !editor) return

    const { from } = editor.state.selection
    const paragraphId =
      editor
        .getJSON()
        .content?.findIndex(
          (node) =>
            node.type === "paragraph" && node.content?.some((textNode) => textNode.text?.includes(selectedText)),
        ) || 0

    const newSuggestion: Suggestion = {
      document_id: documentId,
      daemon: activeDaemon,
      text: selectedText,
      suggestion: currentSuggestion,
      paragraph_id: paragraphId,
      text_offset: from, // Using text_offset instead of offset
      bookmarked: true,
    }

    const { data, error } = await supabase.from("suggestions").insert(newSuggestion).select().single()

    if (error) {
      console.error("Error bookmarking suggestion:", error)
      toast({
        title: "Error bookmarking suggestion",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    setBookmarkedSuggestions([...bookmarkedSuggestions, data])
    setSelectionPosition(null)
    setCurrentSuggestion(null)
    setActiveDaemon(null)

    toast({
      title: "Suggestion bookmarked",
      description: "You can access it from the marker in the margin.",
    })
  }, [documentId, activeDaemon, currentSuggestion, selectedText, editor, supabase, bookmarkedSuggestions, toast])

  const handleDismissSuggestion = useCallback(() => {
    setSelectionPosition(null)
    setCurrentSuggestion(null)
    setActiveDaemon(null)
    setShowDaemonPopover(false)
  }, [])

  const handleCommandSelect = useCallback(
    (command: string) => {
      if (!editor) return

      setShowCommandMenu(false)

      switch (command) {
        case "h1":
          editor.chain().focus().toggleHeading({ level: 1 }).run()
          break
        case "h2":
          editor.chain().focus().toggleHeading({ level: 2 }).run()
          break
        case "bold":
          editor.chain().focus().toggleBold().run()
          break
        case "italic":
          editor.chain().focus().toggleItalic().run()
          break
        case "quote":
          editor.chain().focus().toggleBlockquote().run()
          break
        case "code":
          editor.chain().focus().toggleCodeBlock().run()
          break
        default:
          break
      }
    },
    [editor],
  )

  const handleDeleteBookmark = useCallback(
    async (suggestionId: string) => {
      const { error } = await supabase.from("suggestions").delete().eq("id", suggestionId)

      if (error) {
        console.error("Error deleting bookmark:", error)
        toast({
          title: "Error deleting bookmark",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      setBookmarkedSuggestions(bookmarkedSuggestions.filter((s) => s.id !== suggestionId))
      toast({
        title: "Bookmark deleted",
        description: "The suggestion has been removed.",
      })
    },
    [supabase, bookmarkedSuggestions, toast],
  )

  if (!editor) {
    return null
  }

  return (
    <div className="relative min-h-[85vh]">
      {/* Editor content */}
      <div>
        <EditorContent editor={editor} className="max-w-none focus:outline-none [&_p]:outline-none [&_p]:pl-0" />
      </div>

      {/* Daemon suggestion popover */}
      {selectionPosition && selectedText && showDaemonPopover && (
        <DaemonPopover
          position={selectionPosition}
          selectedText={selectedText}
          onDaemonSelect={handleDaemonSelect}
          onBookmark={handleBookmarkSuggestion}
          onDismiss={handleDismissSuggestion}
          activeDaemon={activeDaemon}
          suggestion={currentSuggestion}
          isGenerating={isGenerating}
        />
      )}

      {/* Slash command menu */}
      {showCommandMenu && commandMenuPosition && (
        <CommandMenu
          position={commandMenuPosition}
          onSelect={handleCommandSelect}
          onClose={() => setShowCommandMenu(false)}
        />
      )}

      {/* Right margin for bookmark markers */}
      <div className="absolute right-0 top-0 w-8 h-full">
        {bookmarkedSuggestions.map((suggestion) => (
          <MarkerDot
            key={suggestion.id}
            suggestion={suggestion}
            editor={editor}
            onDelete={() => handleDeleteBookmark(suggestion.id!)}
          />
        ))}
      </div>
    </div>
  )
}
