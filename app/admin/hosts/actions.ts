"use server"

import { revalidatePath } from "next/cache"
import { createHost, deleteHost, updateHost } from "@/lib/services/hosts-service"
import type { HostInsert, HostUpdate } from "@/types/programs.types"
import { getCurrentUser } from "@/lib/auth"

export async function createHostAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Отримуємо дані з форми
    const name = formData.get("name") as string
    const bio = (formData.get("bio") as string) || null
    const photo = (formData.get("photo") as string) || null
    const email = (formData.get("email") as string) || null
    const phone = (formData.get("phone") as string) || null

    // Соціальні мережі
    const instagram = (formData.get("instagram") as string) || null
    const twitter = (formData.get("twitter") as string) || null
    const facebook = (formData.get("facebook") as string) || null
    const linkedin = (formData.get("linkedin") as string) || null

    const is_active = formData.get("is_active") === "on"

    // Валідація обов'язкових полів
    if (!name) {
      return { success: false, message: "Ім'я ведучого є обов'язковим полем" }
    }

    // Створюємо об'єкт ведучого
    const hostData: HostInsert = {
      name,
      bio,
      photo,
      email,
      phone,
      social_media: {
        instagram,
        twitter,
        facebook,
        linkedin,
      },
      is_active,
      programs: [],
    }

    // Створюємо ведучого
    const host = await createHost(hostData)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/hosts")

    return {
      success: true,
      message: "Ведучого успішно створено",
      id: host.id,
    }
  } catch (error) {
    console.error("Error creating host:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при створенні ведучого",
    }
  }
}

export async function updateHostAction(id: string, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Отримуємо дані з форми
    const name = formData.get("name") as string
    const bio = (formData.get("bio") as string) || null
    const photo = (formData.get("photo") as string) || null
    const email = (formData.get("email") as string) || null
    const phone = (formData.get("phone") as string) || null

    // Соціальні мережі
    const instagram = (formData.get("instagram") as string) || null
    const twitter = (formData.get("twitter") as string) || null
    const facebook = (formData.get("facebook") as string) || null
    const linkedin = (formData.get("linkedin") as string) || null

    const is_active = formData.get("is_active") === "on"

    // Валідація обов'язкових полів
    if (!name) {
      return { success: false, message: "Ім'я ведучого є обов'язковим полем" }
    }

    // Створюємо об'єкт ведучого
    const hostData: HostUpdate = {
      name,
      bio,
      photo,
      email,
      phone,
      social_media: {
        instagram,
        twitter,
        facebook,
        linkedin,
      },
      is_active,
    }

    // Оновлюємо ведучого
    await updateHost(id, hostData)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/hosts")
    revalidatePath(`/admin/hosts/${id}`)

    return {
      success: true,
      message: "Ведучого успішно оновлено",
    }
  } catch (error) {
    console.error("Error updating host:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при оновленні ведучого",
    }
  }
}

export async function deleteHostAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Видаляємо ведучого
    await deleteHost(id)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/hosts")

    return {
      success: true,
      message: "Ведучого успішно видалено",
    }
  } catch (error) {
    console.error("Error deleting host:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при видаленні ведучого",
    }
  }
}

