"use server"

import { revalidatePath } from "next/cache"
import { createProgram, deleteProgram, updateProgram } from "@/lib/services/programs-service"
import type { ProgramInsert, ProgramUpdate } from "@/types/programs.types"
import { getCurrentUser } from "@/lib/auth"

export async function createProgramAction(
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
    const description_uk = formData.get("description_uk") as string
    const description_fr = (formData.get("description_fr") as string) || null
    const description_en = (formData.get("description_en") as string) || null
    const host = (formData.get("host") as string) || null
    const image = (formData.get("image") as string) || null
    const day_of_week = formData.get("day_of_week") as string
    const air_time = formData.get("air_time") as string
    const duration = Number.parseInt(formData.get("duration") as string, 10)
    const is_active = formData.get("is_active") === "on"
    const is_featured = formData.get("is_featured") === "on"
    const slug_uk = formData.get("slug_uk") as string
    const slug_fr = (formData.get("slug_fr") as string) || null
    const slug_en = (formData.get("slug_en") as string) || null

    // Валідація обов'язкових полів
    if (!title_uk || !description_uk || !slug_uk || !day_of_week || !air_time) {
      return { success: false, message: "Заповніть всі обов'язкові поля" }
    }

    // Створюємо об'єкт програми
    const programData: ProgramInsert = {
      title_uk,
      title_fr,
      title_en,
      description_uk,
      description_fr,
      description_en,
      host,
      image,
      day_of_week,
      air_time,
      duration,
      is_active,
      is_featured,
      slug_uk,
      slug_fr,
      slug_en,
    }

    // Створюємо програму
    const program = await createProgram(programData)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/programs")

    return {
      success: true,
      message: "Програму успішно створено",
      id: program.id,
    }
  } catch (error) {
    console.error("Error creating program:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при створенні програми",
    }
  }
}

export async function updateProgramAction(
  id: string,
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Отримуємо дані з форми
    const title_uk = formData.get("title_uk") as string
    const title_fr = (formData.get("title_fr") as string) || null
    const title_en = (formData.get("title_en") as string) || null
    const description_uk = formData.get("description_uk") as string
    const description_fr = (formData.get("description_fr") as string) || null
    const description_en = (formData.get("description_en") as string) || null
    const host = (formData.get("host") as string) || null
    const image = (formData.get("image") as string) || null
    const day_of_week = formData.get("day_of_week") as string
    const air_time = formData.get("air_time") as string
    const duration = Number.parseInt(formData.get("duration") as string, 10)
    const is_active = formData.get("is_active") === "on"
    const is_featured = formData.get("is_featured") === "on"
    const slug_uk = formData.get("slug_uk") as string
    const slug_fr = (formData.get("slug_fr") as string) || null
    const slug_en = (formData.get("slug_en") as string) || null

    // Валідація обов'язкових полів
    if (!title_uk || !description_uk || !slug_uk || !day_of_week || !air_time) {
      return { success: false, message: "Заповніть всі обов'язкові поля" }
    }

    // Створюємо об'єкт програми
    const programData: ProgramUpdate = {
      title_uk,
      title_fr,
      title_en,
      description_uk,
      description_fr,
      description_en,
      host,
      image,
      day_of_week,
      air_time,
      duration,
      is_active,
      is_featured,
      slug_uk,
      slug_fr,
      slug_en,
    }

    // Оновлюємо програму
    await updateProgram(id, programData)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/programs")
    revalidatePath(`/admin/programs/edit/${id}`)

    return {
      success: true,
      message: "Програму успішно оновлено",
    }
  } catch (error) {
    console.error("Error updating program:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при оновленні програми",
    }
  }
}

export async function deleteProgramAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Видаляємо програму
    await deleteProgram(id)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/programs")

    return {
      success: true,
      message: "Програму успішно видалено",
    }
  } catch (error) {
    console.error("Error deleting program:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при видаленні програми",
    }
  }
}

