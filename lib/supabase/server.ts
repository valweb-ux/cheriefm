import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/types/database.types"
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

// For server components (App Router)
export function createClient() {
  // This function should only be used in App Router
  const cookies = require("next/headers").cookies

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
}

// For API routes and pages (Pages Router)
export function createClientForPages(cookiesObj: ReadonlyRequestCookies) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
}

