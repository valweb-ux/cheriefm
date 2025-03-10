import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/database.types"

export function createClient() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables")
      throw new Error("Missing required environment variables for Supabase")
    }

    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    )
  } catch (error) {
    console.error("Error creating browser Supabase client:", error)
    throw error
  }
}

