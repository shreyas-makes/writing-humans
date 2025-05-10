"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Document } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { PlusCircle, FileText, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function DocumentsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const supabase = getSupabaseClient()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push("/login")
      return
    }

    fetchDocuments()
  }, [user, loading, router])

  const fetchDocuments = async () => {
    if (!user) return

    setIsLoading(true)

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      toast({
        title: "Error fetching documents",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setDocuments(data || [])
    }

    setIsLoading(false)
  }

  const createNewDocument = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        title: "Untitled Document",
        content: "",
      })
      .select()
      .single()

    if (error) {
      toast({
        title: "Error creating document",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    router.push(`/editor/${data.id}`)
  }

  const deleteDocument = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const { error } = await supabase.from("documents").delete().eq("id", id)

    if (error) {
      toast({
        title: "Error deleting document",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    setDocuments(documents.filter((doc) => doc.id !== id))

    toast({
      title: "Document deleted",
      description: "Your document has been deleted successfully.",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Documents</h1>
        <Button onClick={createNewDocument}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">No documents yet</h2>
          <p className="text-muted-foreground mb-4">Create your first document to get started.</p>
          <Button onClick={createNewDocument}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Document
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Link href={`/editor/${doc.id}`} key={doc.id}>
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span className="truncate">{doc.title}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => deleteDocument(doc.id, e)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground truncate">
                    {doc.content
                      ? doc.content.replace(/<[^>]*>/g, "").substring(0, 100) || "Empty document"
                      : "Empty document"}
                  </p>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">Last updated: {formatDate(doc.updated_at)}</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
