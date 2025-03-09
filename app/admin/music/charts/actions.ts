"use server"

import { revalidatePath } from "next/cache"
import { createChart, updateChart, deleteChart } from "@/lib/services/charts-service"
import type { ChartInsert, ChartUpdate } from "@/types/music.types"

export async function createChartAction(data: ChartInsert) {
  try {
    const chart = await createChart(data)
    revalidatePath("/admin/music/charts")
    return { success: true, data: chart }
  } catch (error) {
    console.error("Error creating chart:", error)
    return { success: false, error: error instanceof Error ? error.message : "Помилка при створенні чарту" }
  }
}

export async function updateChartAction(id: string, data: ChartUpdate) {
  try {
    const chart = await updateChart(id, data)
    revalidatePath("/admin/music/charts")
    revalidatePath(`/admin/music/charts/${id}`)
    return { success: true, data: chart }
  } catch (error) {
    console.error("Error updating chart:", error)
    return { success: false, error: error instanceof Error ? error.message : "Помилка при оновленні чарту" }
  }
}

export async function deleteChartAction(id: string) {
  try {
    await deleteChart(id)
    revalidatePath("/admin/music/charts")
    return { success: true }
  } catch (error) {
    console.error("Error deleting chart:", error)
    return { success: false, error: error instanceof Error ? error.message : "Помилка при видаленні чарту" }
  }
}

