import { createClient } from "@/lib/supabase/server"
import type { SocialMediaPost, SocialMediaAccount } from "@/types/integrations.types"

// Отримання всіх соціальних акаунтів
export async function getSocialMediaAccounts(): Promise<SocialMediaAccount[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("social_media_accounts")
    .select("*")
    .order("platform", { ascending: true })

  if (error) {
    console.error("Error fetching social media accounts:", error)
    throw new Error(`Помилка при отриманні соціальних акаунтів: ${error.message}`)
  }

  return data as SocialMediaAccount[]
}

// Отримання акаунту за ID
export async function getSocialMediaAccount(id: string): Promise<SocialMediaAccount> {
  const supabase = createClient()

  const { data, error } = await supabase.from("social_media_accounts").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching social media account:", error)
    throw new Error(`Помилка при отриманні соціального акаунту: ${error.message}`)
  }

  return data as SocialMediaAccount
}

// Оновлення акаунту
export async function updateSocialMediaAccount(
  id: string,
  account: Partial<SocialMediaAccount>,
): Promise<SocialMediaAccount> {
  const supabase = createClient()

  const { data, error } = await supabase.from("social_media_accounts").update(account).eq("id", id).select().single()

  if (error) {
    console.error("Error updating social media account:", error)
    throw new Error(`Помилка при оновленні соціального акаунту: ${error.message}`)
  }

  return data as SocialMediaAccount
}

// Видалення акаунту
export async function deleteSocialMediaAccount(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("social_media_accounts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting social media account:", error)
    throw new Error(`Помилка при видаленні соціального акаунту: ${error.message}`)
  }
}

// Отримання всіх постів
export async function getSocialMediaPosts(
  limit = 10,
  offset = 0,
  status?: string,
): Promise<{ posts: SocialMediaPost[]; count: number }> {
  const supabase = createClient()

  let query = supabase
    .from("social_media_posts")
    .select("*", { count: "exact" })
    .order("scheduledFor", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching social media posts:", error)
    throw new Error(`Помилка при отриманні соціальних постів: ${error.message}`)
  }

  return {
    posts: data as SocialMediaPost[],
    count: count || 0,
  }
}

// Отримання поста за ID
export async function getSocialMediaPost(id: string): Promise<SocialMediaPost> {
  const supabase = createClient()

  const { data, error } = await supabase.from("social_media_posts").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching social media post:", error)
    throw new Error(`Помилка при отриманні соціального поста: ${error.message}`)
  }

  return data as SocialMediaPost
}

// Створення нового поста
export async function createSocialMediaPost(post: Omit<SocialMediaPost, "id">): Promise<SocialMediaPost> {
  const supabase = createClient()

  const { data, error } = await supabase.from("social_media_posts").insert(post).select().single()

  if (error) {
    console.error("Error creating social media post:", error)
    throw new Error(`Помилка при створенні соціального поста: ${error.message}`)
  }

  return data as SocialMediaPost
}

// Оновлення поста
export async function updateSocialMediaPost(id: string, post: Partial<SocialMediaPost>): Promise<SocialMediaPost> {
  const supabase = createClient()

  const { data, error } = await supabase.from("social_media_posts").update(post).eq("id", id).select().single()

  if (error) {
    console.error("Error updating social media post:", error)
    throw new Error(`Помилка при оновленні соціального поста: ${error.message}`)
  }

  return data as SocialMediaPost
}

// Видалення поста
export async function deleteSocialMediaPost(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("social_media_posts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting social media post:", error)
    throw new Error(`Помилка при видаленні соціального поста: ${error.message}`)
  }
}

// Публікація поста зараз
export async function publishPostNow(id: string): Promise<SocialMediaPost> {
  // Тут буде логіка для публікації поста через API соціальних мереж
  // Для прикладу, просто оновлюємо статус
  return updateSocialMediaPost(id, {
    status: "published",
    scheduledFor: new Date(),
  })
}

// Отримання постів для запланованої публікації
export async function getScheduledPostsForPublishing(): Promise<SocialMediaPost[]> {
  const supabase = createClient()

  const now = new Date()

  const { data, error } = await supabase
    .from("social_media_posts")
    .select("*")
    .eq("status", "scheduled")
    .lt("scheduledFor", now.toISOString())

  if (error) {
    console.error("Error fetching scheduled posts:", error)
    throw new Error(`Помилка при отриманні запланованих постів: ${error.message}`)
  }

  return data as SocialMediaPost[]
}

