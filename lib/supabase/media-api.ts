"use server"

import { createClient } from "@/lib/supabase/server"
import type { MediaFileWithUrl } from "@/lib/supabase/schema"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import sharp from "sharp"

// Функція для отримання списку файлів з оптимізацією
export async function getMediaFiles(
  folderId?: string,
  search?: string,
  page = 1,
  limit = 20,
): Promise<{ data: MediaFileWithUrl[]; count: number }> {
  const supabase = createClient()
  const offset = (page - 1) * limit

  let query = supabase.from("media_files").select("*", { count: "exact" })

  if (folderId) {
    query = query.eq("folder_id", folderId)
  } else {
    query = query.is("folder_id", null)
  }

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching media files:", error)
    throw new Error(`Помилка при отриманні медіафайлів: ${error.message}`)
  }

  // Отримуємо URL для кожного файлу з кешуванням
  const filesWithUrls = await Promise.all(
    (data || []).map(async (file) => {
      // Створюємо URL з довшим терміном дії для зменшення кількості запитів
      const { data: urlData } = await supabase.storage.from("media").createSignedUrl(file.file_path, 60 * 60 * 24) // URL дійсний 24 години

      let thumbnailUrl
      if (file.file_type.startsWith("image/")) {
        const { data: thumbnailData } = await supabase.storage
          .from("media")
          .createSignedUrl(`thumbnails/${file.id}`, 60 * 60 * 24)

        thumbnailUrl = thumbnailData?.signedUrl
      }

      return {
        ...file,
        url: urlData?.signedUrl || "",
        thumbnail_url: thumbnailUrl,
      }
    }),
  )

  return {
    data: filesWithUrls as MediaFileWithUrl[],
    count: count || 0,
  }
}

// Оптимізована функція для завантаження файлу
export async function uploadMediaFile(
  file: File,
  metadata: {
    alt_text?: string
    description?: string
    is_public?: boolean
    folder_id?: string
  },
): Promise<MediaFileWithUrl> {
  const supabase = createClient()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Ви не авторизовані")
  }

  // Генеруємо унікальне ім'я файлу
  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
  const filePath = `${user.id}/${fileName}`

  // Оптимізуємо зображення перед завантаженням, якщо це зображення
  let fileToUpload = file
  let width, height

  if (file.type.startsWith("image/")) {
    try {
      // Конвертуємо File в ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()

      // Отримуємо метадані зображення
      const metadata = await sharp(arrayBuffer).metadata()
      width = metadata.width
      height = metadata.height

      // Оптимізуємо зображення, якщо воно велике
      if ((width && width > 2000) || (height && height > 2000)) {
        const optimizedBuffer = await sharp(arrayBuffer)
          .resize({
            width: 2000,
            height: 2000,
            fit: "inside",
            withoutEnlargement: true,
          })
          .toBuffer()

        // Конвертуємо назад у File
        fileToUpload = new File([optimizedBuffer], file.name, { type: file.type })
      }

      // Створюємо мініатюру
      const thumbnailBuffer = await sharp(arrayBuffer)
        .resize({
          width: 300,
          height: 300,
          fit: "inside",
          withoutEnlargement: true,
        })
        .toBuffer()

      // Завантажуємо мініатюру
      await supabase.storage.from("media").upload(`thumbnails/${fileName}`, thumbnailBuffer, {
        contentType: file.type,
      })
    } catch (e) {
      console.error("Error processing image:", e)
      // Якщо помилка оптимізації, використовуємо оригінальний файл
    }
  }

  // Завантажуємо файл
  const { error: uploadError } = await supabase.storage.from("media").upload(filePath, fileToUpload)

  if (uploadError) {
    console.error("Error uploading file:", uploadError)
    throw new Error(`Помилка при завантаженні файлу: ${uploadError.message}`)
  }

  // Зберігаємо метадані в базі даних
  const { data, error: dbError } = await supabase
    .from("media_files")
    .insert({
      name: file.name,
      file_path: filePath,
      file_type: file.type,
      file_size: fileToUpload.size,
      width,
      height,
      alt_text: metadata.alt_text || "",
      description: metadata.description || "",
      uploaded_by: user.id,
      is_public: metadata.is_public || false,
      folder_id: metadata.folder_id,
    })
    .select()
    .single()

  if (dbError) {
    console.error("Error saving file metadata:", dbError)

    // Видаляємо файл, якщо не вдалося зберегти метадані
    await supabase.storage.from("media").remove([filePath])
    await supabase.storage.from("media").remove([`thumbnails/${fileName}`])

    throw new Error(`Помилка при збереженні метаданих файлу: ${dbError.message}`)
  }

  // Отримуємо URL файлу
  const { data: urlData } = await supabase.storage.from("media").createSignedUrl(filePath, 60 * 60 * 24)

  revalidatePath("/admin/media")

  return {
    ...data,
    url: urlData?.signedUrl || "",
  }
}

