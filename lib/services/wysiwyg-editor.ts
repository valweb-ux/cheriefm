import { createClient } from "@/lib/supabase/server"

// Функція для завантаження зображення з WYSIWYG-редактора
export async function uploadEditorImage(file: File): Promise<string> {
  const supabase = createClient()

  // Генеруємо унікальне ім'я файлу
  const fileExt = file.name.split(".").pop()
  const fileName = `editor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
  const filePath = `editor/${fileName}`

  // Завантажуємо файл
  const { error: uploadError, data } = await supabase.storage.from("media").upload(filePath, file)

  if (uploadError) {
    console.error("Error uploading editor image:", uploadError)
    throw new Error(`Помилка при завантаженні зображення: ${uploadError.message}`)
  }

  // Отримуємо публічне URL зображення
  const { data: urlData } = await supabase.storage.from("media").getPublicUrl(filePath)

  return urlData.publicUrl
}

// Функція для збереження версії контенту
export async function saveContentVersion(
  contentType: string,
  contentId: string,
  content: string,
  userId: string,
  comment?: string,
): Promise<void> {
  const supabase = createClient()

  // Створюємо запис версії контенту
  const { error } = await supabase.from("content_versions").insert({
    content_type: contentType,
    content_id: contentId,
    content: content,
    created_by: userId,
    comment: comment || null,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error saving content version:", error)
    throw new Error(`Помилка при збереженні версії контенту: ${error.message}`)
  }
}

// Функція для отримання історії версій контенту
export async function getContentVersions(contentType: string, contentId: string, limit = 10): Promise<any[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("content_versions")
    .select("*, users(email)")
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching content versions:", error)
    throw new Error(`Помилка при отриманні версій контенту: ${error.message}`)
  }

  return data
}

// Функція для відновлення контенту з попередньої версії
export async function restoreContentVersion(
  versionId: string,
  contentType: string,
  contentId: string,
): Promise<string> {
  const supabase = createClient()

  // Отримуємо версію контенту
  const { data, error } = await supabase.from("content_versions").select("content").eq("id", versionId).single()

  if (error) {
    console.error("Error fetching content version:", error)
    throw new Error(`Помилка при отриманні версії контенту: ${error.message}`)
  }

  // Оновлюємо контент в залежності від типу
  let updateTable = ""

  switch (contentType) {
    case "news":
      updateTable = "news"
      break
    case "page":
      updateTable = "pages"
      break
    case "program":
      updateTable = "programs"
      break
    case "episode":
      updateTable = "episodes"
      break
    default:
      throw new Error(`Непідтримуваний тип контенту: ${contentType}`)
  }

  // Оновлюємо контент
  const { error: updateError } = await supabase
    .from(updateTable)
    .update({
      content_uk: data.content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", contentId)

  if (updateError) {
    console.error("Error restoring content version:", updateError)
    throw new Error(`Помилка при відновленні версії контенту: ${updateError.message}`)
  }

  return data.content
}

