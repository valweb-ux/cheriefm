"use server"

import { revalidatePath } from "next/cache"
import { restoreNewsVersion as restore } from "@/lib/services/version-service"

export async function restoreNewsVersion(newsId: string, versionId: string) {
  try {
    await restore(newsId, versionId)
    revalidatePath(`/admin/news/${newsId}`)
    revalidatePath(`/admin/news/${newsId}/history`)
    return { success: true }
  } catch (error) {
    console.error("Error restoring news version:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при відновленні версії",
    }
  }
}

