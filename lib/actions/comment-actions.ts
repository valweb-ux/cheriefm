"use server"

import { revalidatePath } from "next/cache"
import {
  approveComment as approve,
  rejectComment as reject,
  deleteComment as remove,
} from "@/lib/services/comment-service"

export async function approveComment(id: string) {
  try {
    await approve(id)
    revalidatePath("/admin/news")
    revalidatePath("/admin/comments")
    return { success: true }
  } catch (error) {
    console.error("Error approving comment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при схваленні коментаря",
    }
  }
}

export async function rejectComment(id: string) {
  try {
    await reject(id)
    revalidatePath("/admin/news")
    revalidatePath("/admin/comments")
    return { success: true }
  } catch (error) {
    console.error("Error rejecting comment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при відхиленні коментаря",
    }
  }
}

export async function deleteComment(id: string) {
  try {
    await remove(id)
    revalidatePath("/admin/news")
    revalidatePath("/admin/comments")
    return { success: true }
  } catch (error) {
    console.error("Error deleting comment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при видаленні коментаря",
    }
  }
}

