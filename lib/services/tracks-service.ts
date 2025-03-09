import { createClient } from "@/lib/supabase/server"
import type { Track, TrackInsert, TrackUpdate } from "@/types/music.types"

export async function getTracks(
  options: {
    limit?: number
    offset?: number
    search?: string
    artistId?: string
    genre?: string
    featured?: boolean
    active?: boolean
    orderBy?: string
    orderDirection?: "asc" | "desc"
  } = {},
): Promise<{ data: Track[]; count: number }> {
  const {
    limit = 10,
    offset = 0,
    search = "",
    artistId,
    genre,
    featured,
    active,
    orderBy = "title",
    orderDirection = "asc",
  } = options

  const supabase = createClient()

  // Створюємо базовий запит
  let query = supabase.from("tracks").select("*, artists(*)", { count: "exact" })

  // Додаємо фільтри
  if (search) {
    query = query.or(`title.ilike.%${search}%, album.ilike.%${search}%`)
  }

  if (artistId) {
    query = query.eq("artist_id", artistId)
  }

  if (genre) {
    query = query.eq("genre", genre)
  }

  if (featured !== undefined) {
    query = query.eq("is_featured", featured)
  }

  if (active !== undefined) {
    query = query.eq("is_active", active)
  }

  // Додаємо сортування та пагінацію
  query = query.order(orderBy, { ascending: orderDirection === "asc" }).range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching tracks:", error)
    throw new Error(`Помилка при отриманні треків: ${error.message}`)
  }

  return { data: data as Track[], count: count || 0 }
}

export async function getTrackById(id: string): Promise<Track> {
  const supabase = createClient()

  const { data, error } = await supabase.from("tracks").select("*, artists(*)").eq("id", id).single()

  if (error) {
    console.error("Error fetching track:", error)
    throw new Error(`Помилка при отриманні треку: ${error.message}`)
  }

  return data as Track
}

export async function getTrackBySlug(slug: string): Promise<Track> {
  const supabase = createClient()

  const { data, error } = await supabase.from("tracks").select("*, artists(*)").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching track by slug:", error)
    throw new Error(`Помилка при отриманні треку: ${error.message}`)
  }

  return data as Track
}

export async function createTrack(track: TrackInsert): Promise<Track> {
  const supabase = createClient()

  const { data, error } = await supabase.from("tracks").insert(track).select().single()

  if (error) {
    console.error("Error creating track:", error)
    throw new Error(`Помилка при створенні треку: ${error.message}`)
  }

  return data as Track
}

export async function updateTrack(id: string, track: TrackUpdate): Promise<Track> {
  const supabase = createClient()

  // Додаємо поточну дату до updated_at
  const trackWithDate = {
    ...track,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("tracks").update(trackWithDate).eq("id", id).select().single()

  if (error) {
    console.error("Error updating track:", error)
    throw new Error(`Помилка при оновленні треку: ${error.message}`)
  }

  return data as Track
}

export async function deleteTrack(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("tracks").delete().eq("id", id)

  if (error) {
    console.error("Error deleting track:", error)
    throw new Error(`Помилка при видаленні треку: ${error.message}`)
  }
}

export async function incrementPlayCount(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.rpc("increment_track_play_count", { track_id: id })

  if (error) {
    console.error("Error incrementing play count:", error)
    throw new Error(`Помилка при збільшенні лічильника відтворень: ${error.message}`)
  }
}

export async function getFeaturedTracks(limit = 6): Promise<Track[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("tracks")
    .select("*, artists(*)")
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching featured tracks:", error)
    throw new Error(`Помилка при отриманні рекомендованих треків: ${error.message}`)
  }

  return data as Track[]
}

export async function getPopularTracks(limit = 10): Promise<Track[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("tracks")
    .select("*, artists(*)")
    .eq("is_active", true)
    .order("play_count", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching popular tracks:", error)
    throw new Error(`Помилка при отриманні популярних треків: ${error.message}`)
  }

  return data as Track[]
}

export async function getLatestTracks(limit = 10): Promise<Track[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("tracks")
    .select("*, artists(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching latest tracks:", error)
    throw new Error(`Помилка при отриманні останніх треків: ${error.message}`)
  }

  return data as Track[]
}

export async function generateTrackSlug(title: string, artist?: string): Promise<string> {
  // Базова функція для генерації slug
  let slug = `${artist ? `${artist}-` : ""}${title}`
    .toLowerCase()
    .replace(/[^\w\sа-яґєіїё]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[а-яґєіїё]/g, (match) => {
      const translitMap: { [key: string]: string } = {
        а: "a",
        б: "b",
        в: "v",
        г: "g",
        ґ: "g",
        д: "d",
        е: "e",
        є: "ye",
        ж: "zh",
        з: "z",
        и: "y",
        і: "i",
        ї: "yi",
        й: "y",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "kh",
        ц: "ts",
        ч: "ch",
        ш: "sh",
        щ: "shch",
        ь: "",
        ю: "yu",
        я: "ya",
        ё: "yo",
      }
      return translitMap[match] || match
    })

  // Перевіряємо, чи існує вже такий slug
  const supabase = createClient()
  const { data } = await supabase.from("tracks").select("slug").eq("slug", slug)

  // Якщо slug вже існує, додаємо до нього унікальний ідентифікатор
  if (data && data.length > 0) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`
  }

  return slug
}

