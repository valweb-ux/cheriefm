import { createClient } from "@/lib/supabase/server"
import type { Genre, GenreInsert, GenreUpdate } from "@/types/music.types"

export async function getGenres(): Promise<Genre[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("genres").select("*").order("name")

  if (error) {
    console.error("Error fetching genres:", error)
    throw new Error(`Помилка при отриманні жанрів: ${error.message}`)
  }

  return data as Genre[]
}

export async function getGenreById(id: string): Promise<Genre> {
  const supabase = createClient()

  const { data, error } = await supabase.from("genres").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching genre:", error)
    throw new Error(`Помилка при отриманні жанру: ${error.message}`)
  }

  return data as Genre
}

export async function getGenreBySlug(slug: string): Promise<Genre> {
  const supabase = createClient()

  const { data, error } = await supabase.from("genres").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching genre by slug:", error)
    throw new Error(`Помилка при отриманні жанру: ${error.message}`)
  }

  return data as Genre
}

export async function createGenre(genre: GenreInsert): Promise<Genre> {
  const supabase = createClient()

  const { data, error } = await supabase.from("genres").insert(genre).select().single()

  if (error) {
    console.error("Error creating genre:", error)
    throw new Error(`Помилка при створенні жанру: ${error.message}`)
  }

  return data as Genre
}

export async function updateGenre(id: string, genre: GenreUpdate): Promise<Genre> {
  const supabase = createClient()

  const { data, error } = await supabase.from("genres").update(genre).eq("id", id).select().single()

  if (error) {
    console.error("Error updating genre:", error)
    throw new Error(`Помилка при оновленні жанру: ${error.message}`)
  }

  return data as Genre
}

export async function deleteGenre(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("genres").delete().eq("id", id)

  if (error) {
    console.error("Error deleting genre:", error)
    throw new Error(`Помилка при видаленні жанру: ${error.message}`)
  }
}

export async function generateGenreSlug(name: string): Promise<string> {
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
  const { data } = await supabase.from("genres").select("slug").eq("slug", slug)

  // Якщо slug вже існує, додаємо до нього унікальний ідентифікатор
  if (data && data.length > 0) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`
  }

  return slug
}

