"use server"

import { revalidatePath } from "next/cache"
import { updateSeoSettings } from "@/lib/services/analytics-service"
import type { SeoSettingsUpdate, PageSeoDataUpdate } from "@/types/analytics.types"

export async function updateSeoSettingsAction(formData: FormData) {
  try {
    const data: SeoSettingsUpdate = {}

    // Обробка полів
    for (const [key, value] of formData.entries()) {
      if (
        key === "enable_sitemap" ||
        key === "enable_robots_txt" ||
        key === "enable_structured_data" ||
        key === "enable_canonical_urls"
      ) {
        data[key as keyof SeoSettingsUpdate] = value === "on" || value === "true"
      } else if (key === "custom_meta_tags") {
        try {
          data[key as keyof SeoSettingsUpdate] = JSON.parse(value.toString())
        } catch (e) {
          console.error("Error parsing custom_meta_tags:", e)
        }
      } else if (key === "twitter_card_type") {
        data[key as keyof SeoSettingsUpdate] = value.toString() as any
      } else {
        data[key as keyof SeoSettingsUpdate] = value.toString()
      }
    }

    await updateSeoSettings(data)

    revalidatePath("/admin/analytics/seo")

    return { success: true, message: "SEO налаштування успішно оновлено" }
  } catch (error) {
    console.error("Error updating SEO settings:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при оновленні SEO налаштувань",
    }
  }
}

export async function updatePageSeoDataAction(id: string, formData: FormData) {
  try {
    const data: PageSeoDataUpdate = {}

    // Обробка полів
    for (const [key, value] of formData.entries()) {
      if (key === "no_index" || key === "no_follow") {
        data[key as keyof PageSeoDataUpdate] = value === "on" || value === "true"
      } else {
        data[key as keyof PageSeoDataUpdate] = value.toString()
      }
    }

    // Оновлення даних через API
    const response = await fetch(`/api/analytics/page-seo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Помилка при оновленні SEO даних сторінки")
    }

    revalidatePath("/admin/analytics/seo/pages")

    return { success: true, message: "SEO дані сторінки успішно оновлено" }
  } catch (error) {
    console.error("Error updating page SEO data:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при оновленні SEO даних сторінки",
    }
  }
}

export async function createPageSeoDataAction(formData: FormData) {
  try {
    const data: PageSeoDataUpdate = {}

    // Обробка полів
    for (const [key, value] of formData.entries()) {
      if (key === "no_index" || key === "no_follow") {
        data[key as keyof PageSeoDataUpdate] = value === "on" || value === "true"
      } else {
        data[key as keyof PageSeoDataUpdate] = value.toString()
      }
    }

    // Створення даних через API
    const response = await fetch("/api/analytics/page-seo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Помилка при створенні SEO даних сторінки")
    }

    revalidatePath("/admin/analytics/seo/pages")

    return { success: true, message: "SEO дані сторінки успішно створено" }
  } catch (error) {
    console.error("Error creating page SEO data:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при створенні SEO даних сторінки",
    }
  }
}

