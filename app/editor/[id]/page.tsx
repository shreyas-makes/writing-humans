"use client"

import type React from "react"
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Editor } from "@/components/editor/Editor"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/components/auth/auth-provider"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Home, Save } from "lucide-react"
import { FormattingToolbar } from "@/components/editor/FormattingToolbar"
import type { Editor as TiptapEditor } from '@tiptap/react';

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading } = useAuth()
  const supabase = getSupabaseClient()
  const [documentTitle, setDocumentTitle] = useState("Untitled Document")
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [editorInstance, setEditorInstance] = useState<TiptapEditor | null>(null);
  const documentId = resolvedParams.id

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push("/login")
      return
    }

    const fetchDocument = async () => {
      setIsLoading(true)

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .eq("user_id", user.id)
        .single()

      if (error) {
        toast({
          title: "Error fetching document",
          description: error.message,
          variant: "destructive",
        })
        router.push("/documents")
        return
      }

      setDocumentTitle(data.title)
      setContent(data.content)
      setIsLoading(false)
    }

    fetchDocument()
  }, [documentId, user, loading, router, supabase, toast])

  const saveDocument = async (newContent?: string) => {
    if (!documentId) return

    setIsSaving(true)
    const contentToSave = newContent !== undefined ? newContent : content

    const { error } = await supabase
      .from("documents")
      .update({
        content: contentToSave,
        updated_at: new Date().toISOString(),
        title: documentTitle,
      })
      .eq("id", documentId)

    setIsSaving(false)

    if (error) {
      toast({
        title: "Error saving document",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Document saved",
        description: "Your changes have been saved.",
      })
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(e.target.value)
  }

  const handleContentUpdate = (newContent: string) => {
    setContent(newContent)
  }

  const handleEditorLoad = (editor: TiptapEditor | null) => {
    setEditorInstance(editor);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <Skeleton className="h-[70vh] w-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8 pt-[200px]">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm px-8 py-2 z-10 border-b border-gray-200">
        <div className="max-w-[850px] mx-auto flex flex-col">
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={documentTitle}
              onChange={handleTitleChange}
              onBlur={() => saveDocument()}
              className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 w-full text-left text-[#1F2937]"
            />
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push("/documents")} 
                variant="outline"
                size="icon"
                className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/10"
              >
                <Home className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => saveDocument()} 
                disabled={isSaving} 
                variant="outline"
                size="icon"
                className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/10"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <FormattingToolbar editor={editorInstance} />
          </div>
        </div>
      </div>

      <div className="max-w-[850px] mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="prose prose-sm max-w-none">
          <Editor initialContent={content} onUpdate={handleContentUpdate} documentId={documentId} onEditorLoad={handleEditorLoad} />
        </div>
      </div>
    </div>
  )
}
