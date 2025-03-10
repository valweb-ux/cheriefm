"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createPage(data: any) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("pages").insert([data])

    if (error) {
      console.error(`Error creating page:`, error)
      throw new Error(`Error creating page: ${error.message}`)
    }

    revalidatePath("/admin/pages")
    return { success: true }
  } catch (err) {
    console.error("Unexpected error in createPage:", err)
    throw err
  }
}

export async function updatePage(id: string, data: any) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("pages").update(data).eq("id", id)

    if (error) {
      console.error(`Error updating page ${id}:`, error)
      throw new Error(`Error updating page: ${error.message}`)
    }

    revalidatePath("/admin/pages")
    revalidatePath(`/pages/${data.slug}`)
    return { success: true }
  } catch (err) {
    console.error(`Unexpected error in updatePage for ${id}:`, err)
    throw err
  }
}

export async function deletePage(id: string) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("pages").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting page ${id}:`, error)
      throw new Error(`Error deleting page: ${error.message}`)
    }

    revalidatePath("/admin/pages")
    return { success: true }
  } catch (err) {
    console.error(`Unexpected error in deletePage for ${id}:`, err)
    throw err
  }
}

