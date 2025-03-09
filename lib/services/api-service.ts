import { createClient } from "@/lib/supabase/server"
import type { ApiKey, ApiPermission, ApiUsageStats, ApiRateLimit } from "@/types/integrations.types"
import { randomBytes, createHash } from "crypto"

// Отримання всіх API ключів
export async function getApiKeys(): Promise<ApiKey[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("api_keys").select("*").order("createdAt", { ascending: false })

  if (error) {
    console.error("Error fetching API keys:", error)
    throw new Error(`Помилка при отриманні API ключів: ${error.message}`)
  }

  return data as ApiKey[]
}

// Отримання API ключа за ID
export async function getApiKey(id: string): Promise<ApiKey> {
  const supabase = createClient()

  const { data, error } = await supabase.from("api_keys").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching API key:", error)
    throw new Error(`Помилка при отриманні API ключа: ${error.message}`)
  }

  return data as ApiKey
}

// Створення нового API ключа
export async function createApiKey(
  name: string,
  permissions: ApiPermission[],
  ipRestrictions?: string[],
  expiresAt?: Date,
): Promise<{ apiKey: ApiKey; plainTextKey: string }> {
  const supabase = createClient()

  // Генеруємо випадковий ключ
  const plainTextKey = `chfm_${randomBytes(32).toString("hex")}`

  // Хешуємо ключ для зберігання
  const hashedKey = createHash("sha256").update(plainTextKey).digest("hex")

  const newApiKey = {
    name,
    key: hashedKey,
    permissions,
    ipRestrictions: ipRestrictions || [],
    isActive: true,
    createdAt: new Date(),
    expiresAt: expiresAt || null,
  }

  const { data, error } = await supabase.from("api_keys").insert(newApiKey).select().single()

  if (error) {
    console.error("Error creating API key:", error)
    throw new Error(`Помилка при створенні API ключа: ${error.message}`)
  }

  return {
    apiKey: data as ApiKey,
    plainTextKey,
  }
}

// Оновлення API ключа
export async function updateApiKey(
  id: string,
  updates: Partial<Omit<ApiKey, "id" | "key" | "createdAt">>,
): Promise<ApiKey> {
  const supabase = createClient()

  const { data, error } = await supabase.from("api_keys").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating API key:", error)
    throw new Error(`Помилка при оновленні API ключа: ${error.message}`)
  }

  return data as ApiKey
}

// Деактивація API ключа
export async function deactivateApiKey(id: string): Promise<ApiKey> {
  return updateApiKey(id, { isActive: false })
}

// Видалення API ключа
export async function deleteApiKey(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("api_keys").delete().eq("id", id)

  if (error) {
    console.error("Error deleting API key:", error)
    throw new Error(`Помилка при видаленні API ключа: ${error.message}`)
  }
}

// Перевірка API ключа
export async function validateApiKey(
  key: string,
  ipAddress?: string,
): Promise<{ valid: boolean; apiKey?: ApiKey; error?: string }> {
  const supabase = createClient()

  // Хешуємо ключ для порівняння
  const hashedKey = createHash("sha256").update(key).digest("hex")

  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("key", hashedKey)
    .eq("isActive", true)
    .maybeSingle()

  if (error) {
    console.error("Error validating API key:", error)
    return {
      valid: false,
      error: `Помилка при перевірці API ключа: ${error.message}`,
    }
  }

  if (!data) {
    return {
      valid: false,
      error: "Недійсний API ключ",
    }
  }

  const apiKey = data as ApiKey

  // Перевіряємо термін дії
  if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
    return {
      valid: false,
      error: "API ключ прострочений",
    }
  }

  // Перевіряємо обмеження IP
  if (ipAddress && apiKey.ipRestrictions && apiKey.ipRestrictions.length > 0) {
    if (!apiKey.ipRestrictions.includes(ipAddress)) {
      return {
        valid: false,
        error: "IP-адреса не дозволена для цього API ключа",
      }
    }
  }

  // Оновлюємо lastUsed
  await updateApiKey(apiKey.id, { lastUsed: new Date() })

  return {
    valid: true,
    apiKey,
  }
}

// Логування використання API
export async function logApiUsage(
  apiKeyId: string,
  endpoint: string,
  method: string,
  statusCode: number,
  responseTime: number,
  ipAddress: string,
  userAgent?: string,
): Promise<void> {
  const supabase = createClient()

  const usageLog = {
    apiKeyId,
    endpoint,
    method,
    statusCode,
    responseTime,
    ipAddress,
    userAgent,
    timestamp: new Date(),
  }

  const { error } = await supabase.from("api_usage_stats").insert(usageLog)

  if (error) {
    console.error("Error logging API usage:", error)
  }
}

// Отримання статистики використання API
export async function getApiUsageStats(apiKeyId?: string, startDate?: Date, endDate?: Date): Promise<ApiUsageStats[]> {
  const supabase = createClient()

  let query = supabase.from("api_usage_stats").select("*")

  if (apiKeyId) {
    query = query.eq("apiKeyId", apiKeyId)
  }

  if (startDate) {
    query = query.gte("timestamp", startDate.toISOString())
  }

  if (endDate) {
    query = query.lte("timestamp", endDate.toISOString())
  }

  query = query.order("timestamp", { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching API usage stats:", error)
    throw new Error(`Помилка при отриманні статистики використання API: ${error.message}`)
  }

  return data as ApiUsageStats[]
}

// Перевірка обмеження швидкості
export async function checkRateLimit(
  apiKeyId: string,
  endpoint: string,
): Promise<{ allowed: boolean; resetAt?: Date; error?: string }> {
  const supabase = createClient()

  // Отримуємо налаштування обмеження для цього ключа
  const { data: limitData, error: limitError } = await supabase
    .from("api_rate_limits")
    .select("*")
    .eq("apiKeyId", apiKeyId)
    .maybeSingle()

  if (limitError) {
    console.error("Error fetching rate limit:", limitError)
    return {
      allowed: true, // За замовчуванням дозволяємо, якщо не можемо перевірити
    }
  }

  if (!limitData) {
    // Якщо немає налаштувань обмеження, дозволяємо
    return {
      allowed: true,
    }
  }

  const rateLimit = limitData as ApiRateLimit

  // Перевіряємо, чи минув час скидання
  if (new Date(rateLimit.resetAt) <= new Date()) {
    // Час скидання минув, оновлюємо лічильник
    const resetAt = new Date()
    resetAt.setSeconds(resetAt.getSeconds() + rateLimit.window)

    await supabase
      .from("api_rate_limits")
      .update({
        currentUsage: 1,
        resetAt,
      })
      .eq("apiKeyId", apiKeyId)

    return {
      allowed: true,
    }
  }

  // Перевіряємо, чи не перевищено ліміт
  if (rateLimit.currentUsage >= rateLimit.limit) {
    return {
      allowed: false,
      resetAt: new Date(rateLimit.resetAt),
      error: `Перевищено ліміт запитів. Спробуйте знову після ${new Date(rateLimit.resetAt).toLocaleString()}`,
    }
  }

  // Збільшуємо лічильник використання
  await supabase
    .from("api_rate_limits")
    .update({
      currentUsage: rateLimit.currentUsage + 1,
    })
    .eq("apiKeyId", apiKeyId)

  return {
    allowed: true,
  }
}

// Встановлення обмеження швидкості для API ключа
export async function setRateLimit(apiKeyId: string, limit: number, window: number): Promise<ApiRateLimit> {
  const supabase = createClient()

  const resetAt = new Date()
  resetAt.setSeconds(resetAt.getSeconds() + window)

  const rateLimit = {
    apiKeyId,
    limit,
    window,
    currentUsage: 0,
    resetAt,
  }

  // Перевіряємо, чи існує вже обмеження для цього ключа
  const { data: existingLimit } = await supabase
    .from("api_rate_limits")
    .select("*")
    .eq("apiKeyId", apiKeyId)
    .maybeSingle()

  if (existingLimit) {
    // Оновлюємо існуюче обмеження
    const { data, error } = await supabase
      .from("api_rate_limits")
      .update(rateLimit)
      .eq("apiKeyId", apiKeyId)
      .select()
      .single()

    if (error) {
      console.error("Error updating rate limit:", error)
      throw new Error(`Помилка при оновленні обмеження швидкості: ${error.message}`)
    }

    return data as ApiRateLimit
  } else {
    // Створюємо нове обмеження
    const { data, error } = await supabase.from("api_rate_limits").insert(rateLimit).select().single()

    if (error) {
      console.error("Error creating rate limit:", error)
      throw new Error(`Помилка при створенні обмеження швидкості: ${error.message}`)
    }

    return data as ApiRateLimit
  }
}

// Видалення обмеження швидкості для API ключа
export async function deleteRateLimit(apiKeyId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("api_rate_limits").delete().eq("apiKeyId", apiKeyId)

  if (error) {
    console.error("Error deleting rate limit:", error)
    throw new Error(`Помилка при видаленні обмеження швидкості: ${error.message}`)
  }
}

