"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  return session.user
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/admin/login")
  }

  return user
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  cookies().delete("supabase-auth-token")
}

