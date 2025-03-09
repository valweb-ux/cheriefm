import { createClient } from "@/lib/supabase/server"
import type { Version } from "@/types/version.types"
import type { News } from "@/types/news.types"

// Отримання всіх версій новини
export async function getNewsVersions(newsId: string): Promise<Version[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("news_versions")
    .select("*")
    .eq("newsId", newsId)
    .order("createdAt", { ascending: false })

  if (error) {
    console.error("Error fetching news versions:", error)
    throw new Error(`Помилка при отриманні версій новини: ${error.message}`)
  }

  return data as Version[]
}

// Отримання конкретної версії
export async function getNewsVersion(versionId: string): Promise<Version> {
  const supabase = createClient()

  const { data, error } = await supabase.from("news_versions").select("*").eq("id", versionId).single()

  if (error) {
    console.error("Error fetching news version:", error)
    throw new Error(`Помилка при отриманні версії новини: ${error.message}`)
  }

  return data as Version
}

// Створення нової версії
export async function createNewsVersion(
  newsId: string,
  data: Partial<News>,
  changes: Record<string, boolean>,
  createdBy?: string,
): Promise<Version> {
  const supabase = createClient()

  const version = {
    newsId,
    data,
    changes,
    createdAt: new Date(),
    createdBy,
  }

  const { data: versionData, error } = await supabase.from("news_versions").insert(version).select().single()

  if (error) {
    console.error("Error creating news version:", error)
    throw new Error(`Помилка при створенні версії новини: ${error.message}`)
  }

  return versionData as Version
}

// Відновлення новини до попередньої версії
export async function restoreNewsVersion(newsId: string, versionId: string): Promise<News> {
  const supabase = createClient()

  // Отримуємо версію, до якої хочемо відновити
  const version = await getNewsVersion(versionId)

  // Отримуємо поточну новину
  const { data: currentNews, error: currentNewsError } = await supabase
    .from("news")
    .select("*")
    .eq("id", newsId)
    .single()

  if (currentNewsError) {
    console.error("Error fetching current news:", currentNewsError)
    throw new Error(`Помилка при отриманні поточної новини: ${currentNewsError.message}`)
  }

  // Створюємо версію поточної новини перед відновленням
  await createNewsVersion(newsId, currentNews as News, { restored: true }, "Система (перед відновленням)")

  // Оновлюємо новину даними з версії
  const { data: updatedNews, error: updateError } = await supabase
    .from("news")
    .update({
      ...version.data,
      updatedAt: new Date(),
    })
    .eq("id", newsId)
    .select()
    .single()

  if (updateError) {
    console.error("Error restoring news version:", updateError)
    throw new Error(`Помилка при відновленні версії новини: ${updateError.message}`)
  }

  // Створюємо нову версію після відновлення
  await createNewsVersion(newsId, updatedNews as News, { restored: true }, "Система (відновлено)")

  return updatedNews as News
}

