"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createEpisode(data: any) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("episodes").insert([data])

    if (error) {
      console.error(`Error creating episode:`, error)
      throw new Error(`Error creating episode: ${error.message}`)
    }

    revalidatePath("/admin/episodes")
    return { success: true }
  } catch (err) {
    console.error("Unexpected error in createEpisode:", err)
    throw err
  }
}

export async function updateEpisode(id: string, data: any) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("episodes").update(data).eq("id", id)

    if (error) {
      console.error(`Error updating episode ${id}:`, error)
      throw new Error(`Error updating episode: ${error.message}`)
    }

    revalidatePath("/admin/episodes")
    revalidatePath(`/episodes/${id}`)
    return { success: true }
  } catch (err) {
    console.error(`Unexpected error in updateEpisode for ${id}:`, err)
    throw err
  }
}

export async function deleteEpisode(id: string) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("episodes").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting episode ${id}:`, error)
      throw new Error(`Error deleting episode: ${error.message}`)
    }

    revalidatePath("/admin/episodes")
    return { success: true }
  } catch (err) {
    console.error(`Unexpected error in deleteEpisode for ${id}:`, err)
    throw err
  }
}

