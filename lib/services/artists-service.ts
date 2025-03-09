import { createClient } from "@/lib/supabase/server"
import type { Artist, ArtistInsert, ArtistUpdate } from "@/types/music.types"

export async function getArtists(
  options: {
    limit?: number
    offset?: number
    search?: string
    featured?: boolean
    active?: boolean
    orderBy?: string
    orderDirection?: "asc" | "desc"
  } = {},
): Promise<{ data: Artist[]; count: number }> {
  const { limit = 10, offset = 0, search = "", featured, active, orderBy = "name", orderDirection = "asc" } = options

  const supabase = createClient()

  // Створюємо базовий запит
  let query = supabase.from("artists").select("*", { count: "exact" })

  // Додаємо фільтри
  if (search) {
    query = query.ilike("name", `%${search}%`)
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
    console.error("Error fetching artists:", error)
    throw new Error(`Помилка при отриманні артистів: ${error.message}`)
  }

  return { data: data as Artist[], count: count || 0 }
}

export async function getArtistById(id: string): Promise<Artist> {
  const supabase = createClient()

  const { data, error } = await supabase.from("artists").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching artist:", error)
    throw new Error(`Помилка при отриманні артиста: ${error.message}`)
  }

  return data as Artist
}

export async function getArtistBySlug(slug: string): Promise<Artist> {
  const supabase = createClient()

  const { data, error } = await supabase.from("artists").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching artist by slug:", error)
    throw new Error(`Помилка при отриманні артиста: ${error.message}`)
  }

  return data as Artist
}

export async function createArtist(artist: ArtistInsert): Promise<Artist> {
  const supabase = createClient()

  const { data, error } = await supabase.from("artists").insert(artist).select().single()

  if (error) {
    console.error("Error creating artist:", error)
    throw new Error(`Помилка при створенні артиста: ${error.message}`)
  }

  return data as Artist
}

export async function updateArtist(id: string, artist: ArtistUpdate): Promise<Artist> {
  const supabase = createClient()

  // Додаємо поточну дату до updated_at
  const artistWithDate = {
    ...artist,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("artists").update(artistWithDate).eq("id", id).select().single()

  if (error) {
    console.error("Error updating artist:", error)
    throw new Error(`Помилка при оновленні артиста: ${error.message}`)
  }

  return data as Artist
}

export async function deleteArtist(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("artists").delete().eq("id", id)

  if (error) {
    console.error("Error deleting artist:", error)
    throw new Error(`Помилка при видаленні артиста: ${error.message}`)
  }
}

export async function getFeaturedArtists(limit = 6): Promise<Artist[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("name", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("Error fetching featured artists:", error)
    throw new Error(`Помилка при отриманні рекомендованих артистів: ${error.message}`)
  }

  return data as Artist[]
}

export async function generateArtistSlug(name: string): Promise<string> {
  // Базова функція для генерації slug
  let slug = name
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
  const { data } = await supabase.from("artists").select("slug").eq("slug", slug)

  // Якщо slug вже існує, додаємо до нього унікальний ідентифікатор
  if (data && data.length > 0) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`
  }

  return slug
}

