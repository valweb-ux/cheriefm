import { supabase } from "./supabase"

export async function toggleFavorite(id: number, isFavorite: boolean): Promise<void> {
  const { error } = await supabase.from("radio_stations").update({ is_favorite: isFavorite }).eq("id", id)

  if (error) {
    console.error("Error updating favorite status:", error)
  }
}

