"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  createSocialMediaPost as createPost,
  getSocialMediaAccount,
  publishPostNow,
} from "@/lib/services/social-media-service"
import { postToFacebook } from "@/lib/integrations/facebook"
import { postToTwitter } from "@/lib/integrations/twitter"
import { postToInstagram } from "@/lib/integrations/instagram"
import type { SocialPlatform } from "@/types/integrations.types"

interface CreateSocialMediaPostParams {
  content: string
  imageUrl?: string
  link?: string
  platforms: SocialPlatform[]
  scheduledFor?: Date
  newsId?: string
}

export async function createSocialMediaPost(params: CreateSocialMediaPostParams) {
  try {
    const { content, imageUrl, link, platforms, scheduledFor, newsId } = params

    // Створюємо запис про пост у базі даних
    const post = await createPost({
      content,
      imageUrl,
      link,
      platforms,
      status: scheduledFor ? "scheduled" : "draft",
      scheduledFor: scheduledFor,
      postIds: {},
      newsId,
    })

    // Якщо пост не запланований, публікуємо його зараз
    if (!scheduledFor) {
      const results = await publishToSocialMedia(post.id)

      if (!results.success) {
        return {
          success: false,
          error: results.error,
        }
      }
    }

    revalidatePath("/admin/news")
    revalidatePath("/admin/integrations/social-media")

    return {
      success: true,
      postId: post.id,
    }
  } catch (error) {
    console.error("Error creating social media post:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при створенні поста",
    }
  }
}

export async function publishToSocialMedia(postId: string) {
  try {
    const post = await publishPostNow(postId)
    const postIds: Record<string, string> = {}
    let hasErrors = false
    let errorMessage = ""

    // Публікуємо на кожній платформі
    for (const platform of post.platforms) {
      try {
        const account = await getSocialMediaAccount(platform)

        if (!account || !account.isConnected) {
          continue
        }

        let result

        switch (platform) {
          case "facebook":
            result = await postToFacebook(post, account.accessToken, account.profileId)
            break
          case "twitter":
            result = await postToTwitter(post, account.accessToken)
            break
          case "instagram":
            result = await postToInstagram(post, account.accessToken, account.profileId)
            break
          default:
            continue
        }

        if (result.success && result.postId) {
          postIds[platform] = result.postId
        } else {
          hasErrors = true
          errorMessage += `Помилка публікації на ${platform}: ${result.error}. `
        }
      } catch (error) {
        console.error(`Error publishing to ${platform}:`, error)
        hasErrors = true
        errorMessage += `Помилка публікації на ${platform}: ${error instanceof Error ? error.message : "Невідома помилка"}. `
      }
    }

    // Оновлюємо запис у базі даних з ID постів на платформах
    const supabase = createClient()
    await supabase
      .from("social_media_posts")
      .update({
        postIds,
        status: Object.keys(postIds).length > 0 ? "published" : hasErrors ? "failed" : "draft",
        errorMessage: hasErrors ? errorMessage : null,
      })
      .eq("id", postId)

    revalidatePath("/admin/news")
    revalidatePath("/admin/integrations/social-media")

    return {
      success: !hasErrors || Object.keys(postIds).length > 0,
      error: errorMessage,
    }
  } catch (error) {
    console.error("Error publishing to social media:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при публікації в соціальних мережах",
    }
  }
}

