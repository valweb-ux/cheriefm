import { createClient } from "@/lib/supabase/server"
import type {
  SiteSettings,
  SiteSettingsUpdate,
  HomepageSettings,
  HomepageSettingsUpdate,
  NavigationItem,
  NavigationItemInsert,
  NavigationItemUpdate,
} from "@/types/settings.types"

// Сайт налаштування
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createClient()

  const { data, error } = await supabase.from("site_settings").select("*").single()

  if (error) {
    console.error("Error fetching site settings:", error)
    throw new Error(`Помилка при отриманні налаштувань сайту: ${error.message}`)
  }

  return data as SiteSettings
}

export async function updateSiteSettings(settings: SiteSettingsUpdate): Promise<SiteSettings> {
  const supabase = createClient()

  // Додаємо поточну дату до updated_at
  const settingsWithDate = {
    ...settings,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("site_settings")
    .update(settingsWithDate)
    .eq("id", "1") // Припускаємо, що у нас тільки один запис налаштувань з id=1
    .select()
    .single()

  if (error) {
    console.error("Error updating site settings:", error)
    throw new Error(`Помилка при оновленні налаштувань сайту: ${error.message}`)
  }

  return data as SiteSettings
}

// Налаштування головної сторінки
export async function getHomepageSettings(): Promise<HomepageSettings> {
  const supabase = createClient()

  const { data, error } = await supabase.from("homepage_settings").select("*").single()

  if (error) {
    console.error("Error fetching homepage settings:", error)
    throw new Error(`Помилка при отриманні налаштувань головної сторінки: ${error.message}`)
  }

  return data as HomepageSettings
}

export async function updateHomepageSettings(settings: HomepageSettingsUpdate): Promise<HomepageSettings> {
  const supabase = createClient()

  // Додаємо поточну дату до updated_at
  const settingsWithDate = {
    ...settings,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("homepage_settings")
    .update(settingsWithDate)
    .eq("id", "1") // Припускаємо, що у нас тільки один запис налаштувань з id=1
    .select()
    .single()

  if (error) {
    console.error("Error updating homepage settings:", error)
    throw new Error(`Помилка при оновленні налаштувань головної сторінки: ${error.message}`)
  }

  return data as HomepageSettings
}

// Управління навігацією
export async function getNavigationItems(language = "uk"): Promise<NavigationItem[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("navigation_items")
    .select("*")
    .eq("language", language)
    .eq("is_active", true)
    .order("order", { ascending: true })

  if (error) {
    console.error("Error fetching navigation items:", error)
    throw new Error(`Помилка при отриманні пунктів навігації: ${error.message}`)
  }

  return data as NavigationItem[]
}

export async function getAllNavigationItems(language = "uk"): Promise<NavigationItem[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("navigation_items")
    .select("*")
    .eq("language", language)
    .order("order", { ascending: true })

  if (error) {
    console.error("Error fetching all navigation items:", error)
    throw new Error(`Помилка при отриманні всіх пунктів навігації: ${error.message}`)
  }

  return data as NavigationItem[]
}

export async function createNavigationItem(item: NavigationItemInsert): Promise<NavigationItem> {
  const supabase = createClient()

  const { data, error } = await supabase.from("navigation_items").insert(item).select().single()

  if (error) {
    console.error("Error creating navigation item:", error)
    throw new Error(`Помилка при створенні пункту навігації: ${error.message}`)
  }

  return data as NavigationItem
}

export async function updateNavigationItem(id: string, item: NavigationItemUpdate): Promise<NavigationItem> {
  const supabase = createClient()

  const { data, error } = await supabase.from("navigation_items").update(item).eq("id", id).select().single()

  if (error) {
    console.error("Error updating navigation item:", error)
    throw new Error(`Помилка при оновленні пункту навігації: ${error.message}`)
  }

  return data as NavigationItem
}

export async function deleteNavigationItem(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("navigation_items").delete().eq("id", id)

  if (error) {
    console.error("Error deleting navigation item:", error)
    throw new Error(`Помилка при видаленні пункту навігації: ${error.message}`)
  }
}

export async function reorderNavigationItems(items: { id: string; order: number }[]): Promise<void> {
  const supabase = createClient()

  // Використовуємо транзакцію для оновлення всіх елементів
  for (const item of items) {
    const { error } = await supabase.from("navigation_items").update({ order: item.order }).eq("id", item.id)

    if (error) {
      console.error("Error reordering navigation item:", error)
      throw new Error(`Помилка при зміні порядку пунктів навігації: ${error.message}`)
    }
  }
}

