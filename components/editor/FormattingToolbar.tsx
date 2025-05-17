"use client"

import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Heading1, Heading2, Quote, Code } from "lucide-react"

interface FormattingToolbarProps {
  editor: Editor | null;
}

export function FormattingToolbar({ editor }: FormattingToolbarProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="flex items-center gap-1 p-2 rounded-md bg-white border border-gray-200 mb-4">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={
          editor.isActive('bold')
            ? 'bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90'
            : 'hover:bg-gray-200'
        }
        variant="ghost"
        size="sm"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={
          editor.isActive('italic')
            ? 'bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90'
            : 'hover:bg-gray-200'
        }
        variant="ghost"
        size="sm"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive('heading', { level: 1 })
            ? 'bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90'
            : 'hover:bg-gray-200'
        }
        variant="ghost"
        size="sm"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive('heading', { level: 2 })
            ? 'bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90'
            : 'hover:bg-gray-200'
        }
        variant="ghost"
        size="sm"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
       <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        className={
          editor.isActive('blockquote')
            ? 'bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90'
            : 'hover:bg-gray-200'
        }
        variant="ghost"
        size="sm"
      >
        <Quote className="h-4 w-4" />
      </Button>
       <Button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        className={
          editor.isActive('codeBlock')
            ? 'bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90'
            : 'hover:bg-gray-200'
        }
        variant="ghost"
        size="sm"
      >
        <Code className="h-4 w-4" />
      </Button>
    </div>
  )
} 