"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createPage(data: any) {
  const supabase = createClient()

  const { error } = await supabase.from("pages").insert([data])

  if (error) {
    throw new Error(`Error creating page: ${error.message}`)
  }

  revalidatePath("/admin/pages")
  return { success: true }
}

export async function updatePage(id: string, data: any) {
  const supabase = createClient()

  const { error } = await supabase.from("pages").update(data).eq("id", id)

  if (error) {
    throw new Error(`Error updating page: ${error.message}`)
  }

  revalidatePath("/admin/pages")
  revalidatePath(`/pages/${data.slug}`)
  return { success: true }
}

export async function deletePage(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("pages").delete().eq("id", id)

  if (error) {
    throw new Error(`Error deleting page: ${error.message}`)
  }

  revalidatePath("/admin/pages")
  return { success: true }
}

