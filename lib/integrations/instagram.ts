import type { SocialMediaPost } from "@/types/integrations.types"

interface InstagramPostResponse {
  id?: string
  error?: {
    message: string
    type: string
    code: number
  }
}

export async function postToInstagram(
  post: SocialMediaPost,
  accessToken: string,
  instagramAccountId: string,
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    // Для Instagram потрібно спочатку створити контейнер для медіа
    if (!post.imageUrl) {
      return {
        success: false,
        error: "Для публікації в Instagram потрібно зображення",
      }
    }

    // Крок 1: Створення контейнера для медіа
    const createMediaResponse = await fetch(`https://graph.facebook.com/v18.0/${instagramAccountId}/media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: post.imageUrl,
        caption: post.content,
        access_token: accessToken,
      }),
    })

    const mediaData = await createMediaResponse.json()

    if (!createMediaResponse.ok || mediaData.error) {
      return {
        success: false,
        error: mediaData.error?.message || "Невідома помилка при створенні медіа для Instagram",
      }
    }

    const mediaContainerId = mediaData.id

    // Крок 2: Публікація медіа
    const publishResponse = await fetch(`https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        creation_id: mediaContainerId,
        access_token: accessToken,
      }),
    })

    const publishData = (await publishResponse.json()) as InstagramPostResponse

    if (!publishResponse.ok || publishData.error) {
      return {
        success: false,
        error: publishData.error?.message || "Невідома помилка при публікації в Instagram",
      }
    }

    return {
      success: true,
      postId: publishData.id,
    }
  } catch (error) {
    console.error("Error posting to Instagram:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при публікації в Instagram",
    }
  }
}

export async function getInstagramAccountId(
  accessToken: string,
  facebookPageId: string,
): Promise<{ success: boolean; instagramAccountId?: string; error?: string }> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${facebookPageId}?fields=instagram_business_account&access_token=${accessToken}`,
    )

    const data = await response.json()

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error?.message || "Невідома помилка при отриманні ID Instagram акаунту",
      }
    }

    if (!data.instagram_business_account) {
      return {
        success: false,
        error: "Сторінка Facebook не пов'язана з бізнес-акаунтом Instagram",
      }
    }

    return {
      success: true,
      instagramAccountId: data.instagram_business_account.id,
    }
  } catch (error) {
    console.error("Error getting Instagram account ID:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при отриманні ID Instagram акаунту",
    }
  }
}

