import { createClient } from "@/lib/supabase/server"
import type { Comment } from "@/types/comment.types"

// Отримання коментарів для новини
export async function getCommentsByNewsId(
  newsId: string,
  limit = 10,
  offset = 0,
  status?: string,
): Promise<{ comments: Comment[]; count: number }> {
  const supabase = createClient()

  let query = supabase
    .from("comments")
    .select("*", { count: "exact" })
    .eq("newsId", newsId)
    .order("createdAt", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching comments:", error)
    throw new Error(`Помилка при отриманні коментарів: ${error.message}`)
  }

  return {
    comments: data as Comment[],
    count: count || 0,
  }
}

// Отримання коментаря за ID
export async function getCommentById(id: string): Promise<Comment> {
  const supabase = createClient()

  const { data, error } = await supabase.from("comments").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching comment:", error)
    throw new Error(`Помилка при отриманні коментаря: ${error.message}`)
  }

  return data as Comment
}

// Створення нового коментаря
export async function createComment(comment: Omit<Comment, "id" | "createdAt" | "updatedAt">): Promise<Comment> {
  const supabase = createClient()

  const newComment = {
    ...comment,
    status: "pending", // Всі нові коментарі очікують на схвалення
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const { data, error } = await supabase.from("comments").insert(newComment).select().single()

  if (error) {
    console.error("Error creating comment:", error)
    throw new Error(`Помилка при створенні коментаря: ${error.message}`)
  }

  return data as Comment
}

// Схвалення коментаря
export async function approveComment(id: string): Promise<Comment> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("comments")
    .update({
      status: "approved",
      updatedAt: new Date(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error approving comment:", error)
    throw new Error(`Помилка при схваленні коментаря: ${error.message}`)
  }

  return data as Comment
}

// Відхилення коментаря
export async function rejectComment(id: string): Promise<Comment> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("comments")
    .update({
      status: "rejected",
      updatedAt: new Date(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error rejecting comment:", error)
    throw new Error(`Помилка при відхиленні коментаря: ${error.message}`)
  }

  return data as Comment
}

// Видалення коментаря
export async function deleteComment(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("comments").delete().eq("id", id)

  if (error) {
    console.error("Error deleting comment:", error)
    throw new Error(`Помилка при видаленні коментаря: ${error.message}`)
  }
}

// Отримання кількості коментарів за статусом
export async function getCommentsCountByStatus(): Promise<Record<string, number>> {
  const supabase = createClient()

  const { data, error } = await supabase.from("comments").select("status")

  if (error) {
    console.error("Error fetching comments count:", error)
    throw new Error(`Помилка при отриманні кількості коментарів: ${error.message}`)
  }

  const counts = {
    all: data.length,
    pending: data.filter((c) => c.status === "pending").length,
    approved: data.filter((c) => c.status === "approved").length,
    rejected: data.filter((c) => c.status === "rejected").length,
  }

  return counts
}

