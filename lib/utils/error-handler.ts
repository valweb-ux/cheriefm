import { toast } from "@/hooks/use-toast"
import { ERROR_MESSAGES } from "@/lib/constants"

/**
 * Централізована обробка помилок
 * @param error - Об'єкт помилки
 * @param defaultMessage - Повідомлення за замовчуванням
 * @param showToast - Чи показувати toast повідомлення
 * @returns Повідомлення про помилку
 */
export function handleError(error: unknown, defaultMessage = ERROR_MESSAGES.SERVER_ERROR, showToast = true): string {
  // Визначаємо повідомлення про помилку
  const errorMessage = error instanceof Error ? error.message : defaultMessage

  // Логуємо помилку
  console.error("Error occurred:", error)

  // Показуємо toast повідомлення, якщо потрібно
  if (showToast) {
    toast({
      title: "Помилка",
      description: errorMessage,
      variant: "destructive",
    })
  }

  return errorMessage
}

/**
 * Обробка помилок API
 * @param response - Відповідь від API
 * @throws {Error} - Помилка з повідомленням
 */
export async function handleApiResponse(response: Response): Promise<any> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.message || errorData.error || `HTTP error ${response.status}`
    throw new Error(errorMessage)
  }

  return response.json()
}

/**
 * Обробка помилок Supabase
 * @param error - Об'єкт помилки Supabase
 * @param defaultMessage - Повідомлення за замовчуванням
 * @returns Повідомлення про помилку
 */
export function handleSupabaseError(error: any, defaultMessage = ERROR_MESSAGES.SERVER_ERROR): string {
  if (!error) return ""

  // Supabase помилки мають структуру { message, code, details, hint }
  return error.message || defaultMessage
}

