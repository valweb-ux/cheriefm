import { createClient } from "@/lib/supabase/server"
import type { Playlist, PlaylistInsert, PlaylistUpdate } from "@/types/music.types"

export async function getPlaylists(
  options: {
    limit?: number
    offset?: number
    search?: string
    featured?: boolean
    active?: boolean
    userId?: string
    orderBy?: string
    orderDirection?: "asc" | "desc"
  } = {},
): Promise<{ data: Playlist[]; count: number }> {
  const {
    limit = 10,
    offset = 0,
    search = "",
    featured,
    active,
    userId,
    orderBy = "title",
    orderDirection = "asc",
  } = options

  const supabase = createClient()

  // Створюємо базовий запит
  let query = supabase.from("playlists").select("*", { count: "exact" })

  // Додаємо фільтри
  if (search) {
    query = query.ilike("title", `%${search}%`)
  }

  if (featured !== undefined) {
    query = query.eq("is_featured", featured)
  }

  if (active !== undefined) {
    query = query.eq("is_active", active)
  }

  if (userId) {
    query = query.eq("created_by", userId)
  }

  // Додаємо сортування та пагінацію
  query = query.order(orderBy, { ascending: orderDirection === "asc" }).range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching playlists:", error)
    throw new Error(`Помилка при отриманні плейлистів: ${error.message}`)
  }

  return { data: data as Playlist[], count: count || 0 }
}

export async function getPlaylistById(id: string): Promise<Playlist> {
  const supabase = createClient()

  const { data, error } = await supabase.from("playlists").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching playlist:", error)
    throw new Error(`Помилка при отриманні плейлиста: ${error.message}`)
  }

  return data as Playlist
}

export async function getPlaylistBySlug(slug: string): Promise<Playlist> {
  const supabase = createClient()

  const { data, error } = await supabase.from("playlists").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching playlist by slug:", error)
    throw new Error(`Помилка при отриманні плейлиста: ${error.message}`)
  }

  return data as Playlist
}

export async function createPlaylist(playlist: PlaylistInsert): Promise<Playlist> {
  const supabase = createClient()

  const { data, error } = await supabase.from("playlists").insert(playlist).select().single()

  if (error) {
    console.error("Error creating playlist:", error)
    throw new Error(`Помилка при створенні плейлиста: ${error.message}`)
  }

  return data as Playlist
}

export async function updatePlaylist(id: string, playlist: PlaylistUpdate): Promise<Playlist> {
  const supabase = createClient()

  // Додаємо поточну дату до updated_at
  const playlistWithDate = {
    ...playlist,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("playlists").update(playlistWithDate).eq("id", id).select().single()

  if (error) {
    console.error("Error updating playlist:", error)
    throw new Error(`Помилка при оновленні плейлиста: ${error.message}`)
  }

  return data as Playlist
}

export async function deletePlaylist(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("playlists").delete().eq("id", id)

  if (error) {
    console.error("Error deleting playlist:", error)
    throw new Error(`Помилка при видаленні плейлиста: ${error.message}`)
  }
}

export async function getFeaturedPlaylists(limit = 4): Promise<Playlist[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching featured playlists:", error)
    throw new Error(`Помилка при отриманні рекомендованих плейлистів: ${error.message}`)
  }

  return data as Playlist[]
}

export async function getPlaylistTracks(playlistId: string): Promise<any[]> {
  const supabase = createClient()

  // Спочатку отримуємо плейлист, щоб отримати масив ID треків
  const { data: playlist, error: playlistError } = await supabase
    .from("playlists")
    .select("tracks")
    .eq("id", playlistId)
    .single()

  if (playlistError) {
    console.error("Error fetching playlist tracks:", playlistError)
    throw new Error(`Помилка при отриманні треків плейлиста: ${playlistError.message}`)
  }

  if (!playlist.tracks || playlist.tracks.length === 0) {
    return []
  }

  // Отримуємо треки за їх ID
  const { data: tracks, error: tracksError } = await supabase
    .from("tracks")
    .select("*, artists(*)")
    .in("id", playlist.tracks)
    .order("title")

  if (tracksError) {
    console.error("Error fetching tracks for playlist:", tracksError)
    throw new Error(`Помилка при отриманні треків для плейлиста: ${tracksError.message}`)
  }

  // Сортуємо треки в тому ж порядку, що і в масиві playlist.tracks
  const sortedTracks = playlist.tracks
    .map((trackId: string) => tracks.find((track: any) => track.id === trackId))
    .filter(Boolean)

  return sortedTracks
}

export async function generatePlaylistSlug(title: string): Promise<string> {
  // Базова функція для генерації slug
  let slug = title
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
  const { data } = await supabase.from("playlists").select("slug").eq("slug", slug)

  // Якщо slug вже існує, додаємо до нього унікальний ідентифікатор
  if (data && data.length > 0) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`
  }

  return slug
}

