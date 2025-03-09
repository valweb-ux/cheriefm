"use server"

import { createClientForPages } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function createEpisode(data: any) {
  const supabase = createClientForPages(cookies())

  const { error } = await supabase.from("episodes").insert([data])

  if (error) {
    throw new Error(`Error creating episode: ${error.message}`)
  }

  revalidatePath("/admin/episodes")
  return { success: true }
}

export async function updateEpisode(id: string, data: any) {
  const supabase = createClientForPages(cookies())

  const { error } = await supabase.from("episodes").update(data).eq("id", id)

  if (error) {
    throw new Error(`Error updating episode: ${error.message}`)
  }

  revalidatePath("/admin/episodes")
  revalidatePath(`/episodes/${id}`)
  return { success: true }
}

export async function deleteEpisode(id: string) {
  const supabase = createClientForPages(cookies())

  const { error } = await supabase.from("episodes").delete().eq("id", id)

  if (error) {
    throw new Error(`Error deleting episode: ${error.message}`)
  }

  revalidatePath("/admin/episodes")
  return { success: true }
}

