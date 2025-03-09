"use server"

import { revalidatePath } from "next/cache"
import { createPage, deletePage, updatePage } from "@/lib/services/pages-service"
import type { PageInsert, PageUpdate } from "@/types/pages.types"
import { getCurrentUser } from "@/lib/auth"

export async function createPageAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Отримуємо дані з форми
    const title_uk = formData.get("title_uk") as string
    const title_fr = (formData.get("title_fr") as string) || null
    const title_en = (formData.get("title_en") as string) || null
    const content_uk = formData.get("content_uk") as string
    const content_fr = (formData.get("content_fr") as string) || null
    const content_en = (formData.get("content_en") as string) || null
    const slug_uk = formData.get("slug_uk") as string
    const slug_fr = (formData.get("slug_fr") as string) || null
    const slug_en = (formData.get("slug_en") as string) || null
    const meta_description_uk = (formData.get("meta_description_uk") as string) || null
    const meta_description_fr = (formData.get("meta_description_fr") as string) || null
    const meta_description_en = (formData.get("meta_description_en") as string) || null
    const is_published = formData.get("is_published") === "on"
    const in_menu = formData.get("in_menu") === "on"
    const menu_order = formData.get("menu_order") ? Number.parseInt(formData.get("menu_order") as string, 10) : null
    const parent_id = (formData.get("parent_id") as string) || null

    // Валідація обов'язкових полів
    if (!title_uk || !content_uk || !slug_uk) {
      return { success: false, message: "Заповніть всі обов'язкові поля" }
    }

    // Створюємо об'єкт сторінки
    const pageData: PageInsert = {
      title_uk,
      title_fr,
      title_en,
      content_uk,
      content_fr,
      content_en,
      slug_uk,
      slug_fr,
      slug_en,
      meta_description_uk,
      meta_description_fr,
      meta_description_en,
      is_published,
      in_menu,
      menu_order,
      parent_id,
    }

    // Створюємо сторінку
    const page = await createPage(pageData)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/pages")

    return {
      success: true,
      message: "Сторінку успішно створено",
      id: page.id,
    }
  } catch (error) {
    console.error("Error creating page:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при створенні сторінки",
    }
  }
}

export async function updatePageAction(id: string, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Отримуємо дані з форми
    const title_uk = formData.get("title_uk") as string
    const title_fr = (formData.get("title_fr") as string) || null
    const title_en = (formData.get("title_en") as string) || null
    const content_uk = formData.get("content_uk") as string
    const content_fr = (formData.get("content_fr") as string) || null
    const content_en = (formData.get("content_en") as string) || null
    const slug_uk = formData.get("slug_uk") as string
    const slug_fr = (formData.get("slug_fr") as string) || null
    const slug_en = (formData.get("slug_en") as string) || null
    const meta_description_uk = (formData.get("meta_description_uk") as string) || null
    const meta_description_fr = (formData.get("meta_description_fr") as string) || null
    const meta_description_en = (formData.get("meta_description_en") as string) || null
    const is_published = formData.get("is_published") === "on"
    const in_menu = formData.get("in_menu") === "on"
    const menu_order = formData.get("menu_order") ? Number.parseInt(formData.get("menu_order") as string, 10) : null
    const parent_id = (formData.get("parent_id") as string) || null

    // Валідація обов'язкових полів
    if (!title_uk || !content_uk || !slug_uk) {
      return { success: false, message: "Заповніть всі обов'язкові поля" }
    }

    // Створюємо об'єкт сторінки
    const pageData: PageUpdate = {
      title_uk,
      title_fr,
      title_en,
      content_uk,
      content_fr,
      content_en,
      slug_uk,
      slug_fr,
      slug_en,
      meta_description_uk,
      meta_description_fr,
      meta_description_en,
      is_published,
      in_menu,
      menu_order,
      parent_id,
    }

    // Оновлюємо сторінку
    await updatePage(id, pageData)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/pages")
    revalidatePath(`/admin/pages/edit/${id}`)

    return {
      success: true,
      message: "Сторінку успішно оновлено",
    }
  } catch (error) {
    console.error("Error updating page:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при оновленні сторінки",
    }
  }
}

export async function deletePageAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Видаляємо сторінку
    await deletePage(id)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/pages")

    return {
      success: true,
      message: "Сторінку успішно видалено",
    }
  } catch (error) {
    console.error("Error deleting page:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при видаленні сторінки",
    }
  }
}

