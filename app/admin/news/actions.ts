"use server"

import { revalidatePath } from "next/cache"
import { createNews, deleteNews, updateNews } from "@/lib/services/news-service"
import type { NewsInsert, NewsUpdate } from "@/types/database.types"
import { getCurrentUser } from "@/lib/auth"
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants"

export async function createNewsAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: ERROR_MESSAGES.UNAUTHORIZED }
    }

    // Отримуємо дані з форми
    const title_uk = formData.get("title_uk") as string
    const title_fr = (formData.get("title_fr") as string) || null
    const title_en = (formData.get("title_en") as string) || null
    const content_uk = formData.get("content_uk") as string
    const content_fr = (formData.get("content_fr") as string) || null
    const content_en = (formData.get("content_en") as string) || null
    const excerpt_uk = (formData.get("excerpt_uk") as string) || null
    const excerpt_fr = (formData.get("excerpt_fr") as string) || null
    const excerpt_en = (formData.get("excerpt_en") as string) || null
    const slug_uk = formData.get("slug_uk") as string
    const slug_fr = (formData.get("slug_fr") as string) || null
    const slug_en = (formData.get("slug_en") as string) || null
    const image = (formData.get("image") as string) || null
    const category = formData.get("category") as string
    const tagsString = formData.get("tags") as string
    const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : []
    const featured = formData.get("featured") === "on"
    const published = formData.get("published") === "on"
    const publish_date = formData.get("publish_date") as string

    // Валідація обов'язкових полів
    if (!title_uk || !content_uk || !slug_uk || !category || !publish_date) {
      return { success: false, message: ERROR_MESSAGES.REQUIRED_FIELDS }
    }

    // Створюємо об'єкт новини
    const newsData: NewsInsert = {
      title_uk,
      title_fr,
      title_en,
      content_uk,
      content_fr,
      content_en,
      excerpt_uk,
      excerpt_fr,
      excerpt_en,
      slug_uk,
      slug_fr,
      slug_en,
      image,
      category,
      tags,
      featured,
      published,
      publish_date,
      author_id: user.id,
    }

    // Створюємо новину
    const news = await createNews(newsData)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/news")

    return {
      success: true,
      message: SUCCESS_MESSAGES.CREATED,
      id: news.id,
    }
  } catch (error) {
    console.error("Error creating news:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : ERROR_MESSAGES.CREATE_ERROR,
    }
  }
}

export async function updateNewsAction(id: string, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: ERROR_MESSAGES.UNAUTHORIZED }
    }

    // Отримуємо дані з форми
    const title_uk = formData.get("title_uk") as string
    const title_fr = (formData.get("title_fr") as string) || null
    const title_en = (formData.get("title_en") as string) || null
    const content_uk = formData.get("content_uk") as string
    const content_fr = (formData.get("content_fr") as string) || null
    const content_en = (formData.get("content_en") as string) || null
    const excerpt_uk = (formData.get("excerpt_uk") as string) || null
    const excerpt_fr = (formData.get("excerpt_fr") as string) || null
    const excerpt_en = (formData.get("excerpt_en") as string) || null
    const slug_uk = formData.get("slug_uk") as string
    const slug_fr = (formData.get("slug_fr") as string) || null
    const slug_en = (formData.get("slug_en") as string) || null
    const image = (formData.get("image") as string) || null
    const category = formData.get("category") as string
    const tagsString = formData.get("tags") as string
    const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : []
    const featured = formData.get("featured") === "on"
    const published = formData.get("published") === "on"
    const publish_date = formData.get("publish_date") as string

    // Валідація обов'язкових полів
    if (!title_uk || !content_uk || !slug_uk || !category || !publish_date) {
      return { success: false, message: ERROR_MESSAGES.REQUIRED_FIELDS }
    }

    // Створюємо об'єкт новини
    const newsData: NewsUpdate = {
      title_uk,
      title_fr,
      title_en,
      content_uk,
      content_fr,
      content_en,
      excerpt_uk,
      excerpt_fr,
      excerpt_en,
      slug_uk,
      slug_fr,
      slug_en,
      image,
      category,
      tags,
      featured,
      published,
      publish_date,
    }

    // Оновлюємо новину
    await updateNews(id, newsData)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/news")
    revalidatePath(`/admin/news/edit/${id}`)

    return {
      success: true,
      message: SUCCESS_MESSAGES.UPDATED,
    }
  } catch (error) {
    console.error("Error updating news:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : ERROR_MESSAGES.UPDATE_ERROR,
    }
  }
}

export async function deleteNewsAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: ERROR_MESSAGES.UNAUTHORIZED }
    }

    // Видаляємо новину
    await deleteNews(id)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/news")

    return {
      success: true,
      message: SUCCESS_MESSAGES.DELETED,
    }
  } catch (error) {
    console.error("Error deleting news:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : ERROR_MESSAGES.DELETE_ERROR,
    }
  }
}

