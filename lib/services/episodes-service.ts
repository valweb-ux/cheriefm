import { createClient } from "@/lib/supabase/server"
import type { Episode, EpisodeInsert, EpisodeUpdate } from "@/types/programs.types"

export async function getEpisodes(
  programId?: string,
  page = 1,
  limit = 10,
  search = "",
): Promise<{ data: Episode[]; count: number }> {
  const supabase = createClient()

  // Розрахунок відступу для пагінації
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Базовий запит
  let query = supabase
    .from("episodes")
    .select("*, programs(title_uk)", { count: "exact" })
    .order("air_date", { ascending: false })
    .range(from, to)

  // Фільтр за програмою, якщо вказано
  if (programId) {
    query = query.eq("program_id", programId)
  }

  // Додаємо фільтр пошуку, якщо він є
  if (search) {
    query = query.or(`title_uk.ilike.%${search}%,description_uk.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching episodes:", error)
    throw new Error(`Помилка при отриманні епізодів: ${error.message}`)
  }

  return {
    data: data as Episode[],
    count: count || 0,
  }
}

export async function getEpisodeById(id: string): Promise<Episode> {
  const supabase = createClient()

  const { data, error } = await supabase.from("episodes").select("*, programs(title_uk)").eq("id", id).single()

  if (error) {
    console.error("Error fetching episode by ID:", error)
    throw new Error(`Помилка при отриманні епізоду: ${error.message}`)
  }

  return data as Episode
}

export async function createEpisode(episode: EpisodeInsert): Promise<Episode> {
  const supabase = createClient()

  // Додаємо поточну дату до created_at та updated_at
  const episodeWithDates = {
    ...episode,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("episodes").insert(episodeWithDates).select().single()

  if (error) {
    console.error("Error creating episode:", error)
    throw new Error(`Помилка при створенні епізоду: ${error.message}`)
  }

  return data as Episode
}

export async function updateEpisode(id: string, episode: EpisodeUpdate): Promise<Episode> {
  const supabase = createClient()

  // Додаємо поточну дату до updated_at
  const episodeWithDate = {
    ...episode,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("episodes").update(episodeWithDate).eq("id", id).select().single()

  if (error) {
    console.error("Error updating episode:", error)
    throw new Error(`Помилка при оновленні епізоду: ${error.message}`)
  }

  return data as Episode
}

export async function deleteEpisode(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("episodes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting episode:", error)
    throw new Error(`Помилка при видаленні епізоду: ${error.message}`)
  }
}

export async function getRecentEpisodes(limit = 5): Promise<Episode[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("episodes")
    .select("*, programs(title_uk)")
    .eq("is_published", true)
    .order("air_date", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent episodes:", error)
    throw new Error(`Помилка при отриманні останніх епізодів: ${error.message}`)
  }

  return data as Episode[]
}

