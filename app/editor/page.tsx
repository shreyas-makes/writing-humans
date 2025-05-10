"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewEditorPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push("/login")
      return
    }

    const createNewDocument = async () => {
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
        router.push("/documents")
        return
      }

      router.push(`/editor/${data.id}`)
    }

    createNewDocument()
  }, [user, loading, router, supabase, toast])

  return (
    <div className="max-w-4xl mx-auto p-4 pt-8">
      <Skeleton className="h-12 w-1/3 mb-6" />
      <Skeleton className="h-[85vh] w-full" />
    </div>
  )
}
