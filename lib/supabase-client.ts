import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a singleton instance for the client side
let clientInstance: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (clientInstance) return clientInstance

  clientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return clientInstance
}

// For server components
export const createServerSupabaseClient = () => {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
