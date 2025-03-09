"use server"

import { revalidatePath } from "next/cache"
import { createEpisode, deleteEpisode, updateEpisode } from "@/lib/services/episodes-service"
import type { EpisodeInsert, EpisodeUpdate } from "@/types/programs.types"
import { getCurrentUser } from "@/lib/auth"

export async function createEpisodeAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Отримуємо дані з форми
    const program_id = formData.get("program_id") as string
    const title_uk = formData.get("title_uk") as string
    const title_fr = (formData.get("title_fr") as string) || null
    const title_en = (formData.get("title_en") as string) || null
    const description_uk = formData.get("description_uk") as string
    const description_fr = (formData.get("description_fr") as string) || null
    const description_en = (formData.get("description_en") as string) || null
    const audio_url = formData.get("audio_url") as string
    const image = (formData.get("image") as string) || null
    const air_date = formData.get("air_date") as string
    const duration = Number.parseInt(formData.get("duration") as string, 10)
    const is_published = formData.get("is_published") === "on"
    const slug_uk = formData.get("slug_uk") as string
    const slug_fr = (formData.get("slug_fr") as string) || null
    const slug_en = (formData.get("slug_en") as string) || null

    // Валідація обов'язкових полів
    if (!program_id || !title_uk || !description_uk || !audio_url || !slug_uk || !air_date) {
      return { success: false, message: "Заповніть всі обов'язкові поля" }
    }

    // Створюємо об'єкт епізоду
    const episodeData: EpisodeInsert = {
      program_id,
      title_uk,
      title_fr,
      title_en,
      description_uk,
      description_fr,
      description_en,
      audio_url,
      image,
      air_date,
      duration,
      is_published,
      slug_uk,
      slug_fr,
      slug_en,
    }

    // Створюємо епізод
    const episode = await createEpisode(episodeData)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/episodes")
    revalidatePath(`/admin/programs/${program_id}`)

    return {
      success: true,
      message: "Епізод успішно створено",
      id: episode.id,
    }
  } catch (error) {
    console.error("Error creating episode:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при створенні епізоду",
    }
  }
}

export async function updateEpisodeAction(
  id: string,
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Отримуємо дані з форми
    const program_id = formData.get("program_id") as string
    const title_uk = formData.get("title_uk") as string
    const title_fr = (formData.get("title_fr") as string) || null
    const title_en = (formData.get("title_en") as string) || null
    const description_uk = formData.get("description_uk") as string
    const description_fr = (formData.get("description_fr") as string) || null
    const description_en = (formData.get("description_en") as string) || null
    const audio_url = formData.get("audio_url") as string
    const image = (formData.get("image") as string) || null
    const air_date = formData.get("air_date") as string
    const duration = Number.parseInt(formData.get("duration") as string, 10)
    const is_published = formData.get("is_published") === "on"
    const slug_uk = formData.get("slug_uk") as string
    const slug_fr = (formData.get("slug_fr") as string) || null
    const slug_en = (formData.get("slug_en") as string) || null

    // Валідація обов'язкових полів
    if (!program_id || !title_uk || !description_uk || !audio_url || !slug_uk || !air_date) {
      return { success: false, message: "Заповніть всі обов'язкові поля" }
    }

    // Створюємо об'єкт епізоду
    const episodeData: EpisodeUpdate = {
      program_id,
      title_uk,
      title_fr,
      title_en,
      description_uk,
      description_fr,
      description_en,
      audio_url,
      image,
      air_date,
      duration,
      is_published,
      slug_uk,
      slug_fr,
      slug_en,
    }

    // Оновлюємо епізод
    await updateEpisode(id, episodeData)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/episodes")
    revalidatePath(`/admin/episodes/edit/${id}`)
    revalidatePath(`/admin/programs/${program_id}`)

    return {
      success: true,
      message: "Епізод успішно оновлено",
    }
  } catch (error) {
    console.error("Error updating episode:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при оновленні епізоду",
    }
  }
}

export async function deleteEpisodeAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Видаляємо епізод
    await deleteEpisode(id)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/episodes")

    return {
      success: true,
      message: "Епізод успішно видалено",
    }
  } catch (error) {
    console.error("Error deleting episode:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при видаленні епізоду",
    }
  }
}

