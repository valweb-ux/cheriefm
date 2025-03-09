"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function serverSignIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function serverSignOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  cookies().delete("supabase-auth-token")
  redirect("/")
}

