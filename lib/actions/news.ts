"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createNews(data: any) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("news").insert([data])

    if (error) {
      console.error(`Error creating news:`, error)
      throw new Error(`Error creating news: ${error.message}`)
    }

    revalidatePath("/admin/news")
    revalidatePath("/news")
    return { success: true }
  } catch (err) {
    console.error("Unexpected error in createNews:", err)
    throw err
  }
}

export async function updateNews(id: string, data: any) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("news").update(data).eq("id", id)

    if (error) {
      console.error(`Error updating news ${id}:`, error)
      throw new Error(`Error updating news: ${error.message}`)
    }

    revalidatePath("/admin/news")
    revalidatePath("/news")
    revalidatePath(`/news/${id}`)
    return { success: true }
  } catch (err) {
    console.error(`Unexpected error in updateNews for ${id}:`, err)
    throw err
  }
}

export async function deleteNews(id: string) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("news").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting news ${id}:`, error)
      throw new Error(`Error deleting news: ${error.message}`)
    }

    revalidatePath("/admin/news")
    revalidatePath("/news")
    return { success: true }
  } catch (err) {
    console.error(`Unexpected error in deleteNews for ${id}:`, err)
    throw err
  }
}

