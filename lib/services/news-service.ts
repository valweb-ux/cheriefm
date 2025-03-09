// Імпортуємо константи та утиліти для обробки помилок
import { createClient } from "@/lib/supabase/server"
import type { NewsInsert, NewsItem, NewsUpdate } from "@/types/database.types"
import { handleSupabaseError } from "@/lib/utils/error-handler"
import { ERROR_MESSAGES } from "@/lib/constants"

export async function getNews(
  page = 1,
  limit = 10,
  search = "",
  category = "",
): Promise<{ data: NewsItem[]; count: number }> {
  const supabase = createClient()

  // Розрахунок відступу для пагінації
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Базовий запит
  let query = supabase
    .from("news")
    .select("*", { count: "exact" })
    .order("publish_date", { ascending: false })
    .range(from, to)

  // Додаємо фільтр пошуку, якщо він є
  if (search) {
    query = query.or(`title_uk.ilike.%${search}%,content_uk.ilike.%${search}%`)
  }

  // Додаємо фільтр категорії, якщо він є
  if (category) {
    query = query.eq("category", category)
  }

  const { data, error, count } = await query

  if (error) {
    const errorMessage = handleSupabaseError(error, ERROR_MESSAGES.FETCH_ERROR)
    console.error("Error fetching news:", error)
    throw new Error(`Помилка при отриманні новин: ${errorMessage}`)
  }

  return {
    data: data as NewsItem[],
    count: count || 0,
  }
}

export async function getNewsById(id: string): Promise<NewsItem> {
  const supabase = createClient()

  const { data, error } = await supabase.from("news").select("*").eq("id", id).single()

  if (error) {
    const errorMessage = handleSupabaseError(error, ERROR_MESSAGES.FETCH_ERROR)
    console.error("Error fetching news by ID:", error)
    throw new Error(`Помилка при отриманні новини: ${errorMessage}`)
  }

  return data as NewsItem
}

export async function createNews(news: NewsInsert): Promise<NewsItem> {
  const supabase = createClient()

  // Додаємо поточну дату до created_at та updated_at
  const newsWithDates = {
    ...news,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("news").insert(newsWithDates).select().single()

  if (error) {
    const errorMessage = handleSupabaseError(error, ERROR_MESSAGES.CREATE_ERROR)
    console.error("Error creating news:", error)
    throw new Error(`Помилка при створенні новини: ${errorMessage}`)
  }

  return data as NewsItem
}

export async function updateNews(id: string, news: NewsUpdate): Promise<NewsItem> {
  const supabase = createClient()

  // Додаємо поточну дату до updated_at
  const newsWithDate = {
    ...news,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("news").update(newsWithDate).eq("id", id).select().single()

  if (error) {
    const errorMessage = handleSupabaseError(error, ERROR_MESSAGES.UPDATE_ERROR)
    console.error("Error updating news:", error)
    throw new Error(`Помилка при оновленні новини: ${errorMessage}`)
  }

  return data as NewsItem
}

export async function deleteNews(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("news").delete().eq("id", id)

  if (error) {
    const errorMessage = handleSupabaseError(error, ERROR_MESSAGES.DELETE_ERROR)
    console.error("Error deleting news:", error)
    throw new Error(`Помилка при видаленні новини: ${errorMessage}`)
  }
}

export async function getNewsCategories(): Promise<string[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("news").select("category").order("category")

  if (error) {
    const errorMessage = handleSupabaseError(error, ERROR_MESSAGES.FETCH_ERROR)
    console.error("Error fetching news categories:", error)
    throw new Error(`Помилка при отриманні категорій: ${errorMessage}`)
  }

  // Отримуємо унікальні категорії
  const categories = [...new Set(data.map((item) => item.category))]

  return categories
}

export async function getRecentNews(limit = 5): Promise<NewsItem[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("publish_date", { ascending: false })
    .limit(limit)

  if (error) {
    const errorMessage = handleSupabaseError(error, ERROR_MESSAGES.FETCH_ERROR)
    console.error("Error fetching recent news:", error)
    throw new Error(`Помилка при отриманні останніх новин: ${errorMessage}`)
  }

  return data as NewsItem[]
}

