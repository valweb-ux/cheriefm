"use server"

import { revalidatePath } from "next/cache"
import {
  updateSiteSettings,
  updateHomepageSettings,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  reorderNavigationItems,
} from "@/lib/services/settings-service"
import { updateRadioAdvertSettings } from "@/lib/services/radio-adverts-service"
import type {
  SiteSettingsUpdate,
  HomepageSettingsUpdate,
  NavigationItemInsert,
  NavigationItemUpdate,
} from "@/types/settings.types"
import type { RadioAdvertSettings } from "@/types/radio.types"

export async function updateSiteSettingsAction(formData: FormData) {
  try {
    const data: SiteSettingsUpdate = {}

    // Обробка основних полів
    for (const [key, value] of formData.entries()) {
      if (key === "social_links") continue

      if (key === "streaming_enabled" || key === "maintenance_mode") {
        data[key as keyof SiteSettingsUpdate] = value === "on" || value === "true"
      } else if (key === "available_languages") {
        data[key as keyof SiteSettingsUpdate] = value
          .toString()
          .split(",")
          .map((lang) => lang.trim())
      } else {
        data[key as keyof SiteSettingsUpdate] = value.toString()
      }
    }

    // Обробка соціальних посилань
    const socialLinks: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("social_")) {
        const network = key.replace("social_", "")
        socialLinks[network] = value.toString()
      }
    }

    if (Object.keys(socialLinks).length > 0) {
      data.social_links = socialLinks
    }

    await updateSiteSettings(data)

    revalidatePath("/admin/settings")
    revalidatePath("/")

    return { success: true, message: "Налаштування сайту успішно оновлено" }
  } catch (error) {
    console.error("Error updating site settings:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при оновленні налаштувань сайту",
    }
  }
}

export async function updateHomepageSettingsAction(formData: FormData) {
  try {
    const data: HomepageSettingsUpdate = {}

    // Обробка полів
    for (const [key, value] of formData.entries()) {
      if (key.includes("_enabled")) {
        data[key as keyof HomepageSettingsUpdate] = value === "on" || value === "true"
      } else if (key.includes("_count")) {
        data[key as keyof HomepageSettingsUpdate] = Number.parseInt(value.toString())
      } else {
        data[key as keyof HomepageSettingsUpdate] = value.toString()
      }
    }

    await updateHomepageSettings(data)

    revalidatePath("/admin/settings/homepage")
    revalidatePath("/")

    return { success: true, message: "Налаштування головної сторінки успішно оновлено" }
  } catch (error) {
    console.error("Error updating homepage settings:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при оновленні налаштувань головної сторінки",
    }
  }
}

export async function createNavigationItemAction(formData: FormData) {
  try {
    const data: NavigationItemInsert = {
      title: formData.get("title")?.toString() || "",
      url: formData.get("url")?.toString() || "",
      parent_id: formData.get("parent_id")?.toString() || null,
      order: Number.parseInt(formData.get("order")?.toString() || "0"),
      target: (formData.get("target")?.toString() || "_self") as "_self" | "_blank",
      is_active: formData.get("is_active") === "on" || formData.get("is_active") === "true",
      language: formData.get("language")?.toString() || "uk",
    }

    await createNavigationItem(data)

    revalidatePath("/admin/settings/navigation")
    revalidatePath("/")

    return { success: true, message: "Пункт навігації успішно створено" }
  } catch (error) {
    console.error("Error creating navigation item:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при створенні пункту навігації",
    }
  }
}

export async function updateNavigationItemAction(id: string, formData: FormData) {
  try {
    const data: NavigationItemUpdate = {}

    if (formData.has("title")) data.title = formData.get("title")?.toString() || ""
    if (formData.has("url")) data.url = formData.get("url")?.toString() || ""
    if (formData.has("parent_id")) data.parent_id = formData.get("parent_id")?.toString() || null
    if (formData.has("order")) data.order = Number.parseInt(formData.get("order")?.toString() || "0")
    if (formData.has("target")) data.target = (formData.get("target")?.toString() || "_self") as "_self" | "_blank"
    if (formData.has("is_active"))
      data.is_active = formData.get("is_active") === "on" || formData.get("is_active") === "true"
    if (formData.has("language")) data.language = formData.get("language")?.toString() || "uk"

    await updateNavigationItem(id, data)

    revalidatePath("/admin/settings/navigation")
    revalidatePath("/")

    return { success: true, message: "Пункт навігації успішно оновлено" }
  } catch (error) {
    console.error("Error updating navigation item:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при оновленні пункту навігації",
    }
  }
}

export async function deleteNavigationItemAction(id: string) {
  try {
    await deleteNavigationItem(id)

    revalidatePath("/admin/settings/navigation")
    revalidatePath("/")

    return { success: true, message: "Пункт навігації успішно видалено" }
  } catch (error) {
    console.error("Error deleting navigation item:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при видаленні пункту навігації",
    }
  }
}

export async function reorderNavigationItemsAction(items: { id: string; order: number }[]) {
  try {
    await reorderNavigationItems(items)

    revalidatePath("/admin/settings/navigation")
    revalidatePath("/")

    return { success: true, message: "Порядок пунктів навігації успішно оновлено" }
  } catch (error) {
    console.error("Error reordering navigation items:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при зміні порядку пунктів навігації",
    }
  }
}

export async function updateRadioAdvertSettingsAction(settings: RadioAdvertSettings) {
  try {
    await updateRadioAdvertSettings(settings)

    revalidatePath("/admin/settings/streaming")

    return { success: true, message: "Налаштування реклами успішно оновлено" }
  } catch (error) {
    console.error("Error updating radio advert settings:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при оновленні налаштувань реклами",
    }
  }
}

