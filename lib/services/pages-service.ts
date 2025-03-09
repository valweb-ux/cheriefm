import { createClient } from "@/lib/supabase/server"
import type { Page, PageInsert, PageUpdate } from "@/types/pages.types"

export async function getPages(page = 1, limit = 10, search = ""): Promise<{ data: Page[]; count: number }> {
  const supabase = createClient()

  // Розрахунок відступу для пагінації
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Базовий запит
  let query = supabase
    .from("pages")
    .select("*", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(from, to)

  // Додаємо фільтр пошуку, якщо він є
  if (search) {
    query = query.or(`title_uk.ilike.%${search}%,content_uk.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching pages:", error)
    throw new Error(`Помилка при отриманні сторінок: ${error.message}`)
  }

  return {
    data: data as Page[],
    count: count || 0,
  }
}

export async function getPageById(id: string): Promise<Page> {
  const supabase = createClient()

  const { data, error } = await supabase.from("pages").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching page by ID:", error)
    throw new Error(`Помилка при отриманні сторінки: ${error.message}`)
  }

  return data as Page
}

export async function getPageBySlug(slug: string, language = "uk"): Promise<Page | null> {
  const supabase = createClient()

  const slugField = `slug_${language}`

  const { data, error } = await supabase.from("pages").select("*").eq(slugField, slug).eq("is_published", true).single()

  if (error) {
    if (error.code === "PGRST116") {
      // Сторінка не знайдена
      return null
    }
    console.error("Error fetching page by slug:", error)
    throw new Error(`Помилка при отриманні сторінки: ${error.message}`)
  }

  return data as Page
}

export async function createPage(page: PageInsert): Promise<Page> {
  const supabase = createClient()

  // Додаємо поточну дату до created_at та updated_at
  const pageWithDates = {
    ...page,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("pages").insert(pageWithDates).select().single()

  if (error) {
    console.error("Error creating page:", error)
    throw new Error(`Помилка при створенні сторінки: ${error.message}`)
  }

  return data as Page
}

export async function updatePage(id: string, page: PageUpdate): Promise<Page> {
  const supabase = createClient()

  // Додаємо поточну дату до updated_at
  const pageWithDate = {
    ...page,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("pages").update(pageWithDate).eq("id", id).select().single()

  if (error) {
    console.error("Error updating page:", error)
    throw new Error(`Помилка при оновленні сторінки: ${error.message}`)
  }

  return data as Page
}

export async function deletePage(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("pages").delete().eq("id", id)

  if (error) {
    console.error("Error deleting page:", error)
    throw new Error(`Помилка при видаленні сторінки: ${error.message}`)
  }
}

