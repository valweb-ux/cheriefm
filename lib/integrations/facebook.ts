import type { SocialMediaPost } from "@/types/integrations.types"

interface FacebookPostResponse {
  id: string
  post_id?: string
  error?: {
    message: string
    type: string
    code: number
  }
}

export async function postToFacebook(
  post: SocialMediaPost,
  accessToken: string,
  pageId: string,
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    // Підготовка даних для публікації
    const postData: Record<string, any> = {
      message: post.content,
      access_token: accessToken,
    }

    // Додаємо посилання, якщо воно є
    if (post.link) {
      postData.link = post.link
    }

    // Додаємо зображення, якщо воно є
    if (post.imageUrl) {
      // Для зображення потрібно використовувати інший ендпоінт або параметри
      // Це спрощений приклад
      postData.url = post.imageUrl
    }

    // Виконуємо запит до Facebook Graph API
    const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })

    const data = (await response.json()) as FacebookPostResponse

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error?.message || "Невідома помилка при публікації на Facebook",
      }
    }

    return {
      success: true,
      postId: data.id,
    }
  } catch (error) {
    console.error("Error posting to Facebook:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при публікації на Facebook",
    }
  }
}

export async function getFacebookPageAccessToken(
  userAccessToken: string,
  pageId: string,
): Promise<{ success: boolean; accessToken?: string; error?: string }> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=access_token&access_token=${userAccessToken}`,
    )

    const data = await response.json()

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error?.message || "Невідома помилка при отриманні токену сторінки",
      }
    }

    return {
      success: true,
      accessToken: data.access_token,
    }
  } catch (error) {
    console.error("Error getting Facebook page access token:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при отриманні токену сторінки",
    }
  }
}

export async function getPagesList(
  accessToken: string,
): Promise<{ success: boolean; pages?: Array<{ id: string; name: string }>; error?: string }> {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`)

    const data = await response.json()

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error?.message || "Невідома помилка при отриманні списку сторінок",
      }
    }

    const pages = data.data.map((page: any) => ({
      id: page.id,
      name: page.name,
    }))

    return {
      success: true,
      pages,
    }
  } catch (error) {
    console.error("Error getting Facebook pages list:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при отриманні списку сторінок",
    }
  }
}

