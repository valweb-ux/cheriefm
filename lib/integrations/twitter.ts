import type { SocialMediaPost } from "@/types/integrations.types"

interface TwitterPostResponse {
  data?: {
    id: string
    text: string
  }
  errors?: Array<{
    title: string
    detail: string
    type: string
  }>
}

export async function postToTwitter(
  post: SocialMediaPost,
  accessToken: string,
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    // Підготовка даних для публікації
    const postData: Record<string, any> = {
      text: post.content,
    }

    // Додаємо посилання, якщо воно є
    if (post.link) {
      // Twitter автоматично обробляє посилання в тексті
      if (!postData.text.includes(post.link)) {
        postData.text += ` ${post.link}`
      }
    }

    // Для зображень потрібно спочатку завантажити медіа, а потім додати ID
    // Це спрощений приклад без завантаження зображень

    // Виконуємо запит до Twitter API v2
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })

    const data = (await response.json()) as TwitterPostResponse

    if (!response.ok || data.errors) {
      return {
        success: false,
        error: data.errors?.[0]?.detail || "Невідома помилка при публікації в Twitter",
      }
    }

    return {
      success: true,
      postId: data.data?.id,
    }
  } catch (error) {
    console.error("Error posting to Twitter:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при публікації в Twitter",
    }
  }
}

export async function getTwitterUserInfo(
  accessToken: string,
): Promise<{ success: boolean; user?: { id: string; username: string }; error?: string }> {
  try {
    const response = await fetch("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok || data.errors) {
      return {
        success: false,
        error: data.errors?.[0]?.detail || "Невідома помилка при отриманні інформації користувача Twitter",
      }
    }

    return {
      success: true,
      user: {
        id: data.data.id,
        username: data.data.username,
      },
    }
  } catch (error) {
    console.error("Error getting Twitter user info:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при отриманні інформації користувача Twitter",
    }
  }
}

