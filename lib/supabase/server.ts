import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/types/database.types"
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

// For server components (App Router)
export function createClient() {
  try {
    // This function should only be used in App Router
    const cookies = require("next/headers").cookies

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables")
      throw new Error("Missing required environment variables for Supabase")
    }

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookies().set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookies().set({ name, value: "", ...options })
          },
        },
      },
    )

    return supabase
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw error
  }
}

// For API routes and pages (Pages Router)
export function createClientForPages(cookiesObj: ReadonlyRequestCookies) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables")
      throw new Error("Missing required environment variables for Supabase")
    }

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return cookiesObj.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // This is handled by the framework in API routes
            // This function is just a placeholder for the interface
          },
          remove(name: string, options: any) {
            // This is handled by the framework in API routes
            // This function is just a placeholder for the interface
          },
        },
      },
    )

    return supabase
  } catch (error) {
    console.error("Error creating Supabase client for pages:", error)
    throw error
  }
}

