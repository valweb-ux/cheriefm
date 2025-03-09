import { createClient } from "@/lib/supabase/server"
import type { RadioAdvert, RadioAdvertSettings, UserTargetingData } from "@/types/radio.types"
import { DEVICE_TYPES, BROWSERS, ERROR_MESSAGES } from "@/lib/constants"
import { handleSupabaseError } from "@/lib/utils/error-handler"

// Отримання всіх рекламних роликів
export async function getAllRadioAdverts(): Promise<RadioAdvert[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("radio_adverts").select("*").order("priority", { ascending: false })

  if (error) {
    const errorMessage = handleSupabaseError(error, ERROR_MESSAGES.FETCH_ERROR)
    console.error("Error fetching radio adverts:", error)
    throw new Error(`Помилка при отриманні рекламних роликів: ${errorMessage}`)
  }

  return data as RadioAdvert[]
}

// Отримання активних рекламних роликів
export async function getActiveRadioAdverts(): Promise<RadioAdvert[]> {
  const supabase = createClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("radio_adverts")
    .select("*")
    .eq("isActive", true)
    .or(`startDate.is.null,startDate.lte.${now}`)
    .or(`endDate.is.null,endDate.gte.${now}`)
    .order("priority", { ascending: false })

  if (error) {
    const errorMessage = handleSupabaseError(error, ERROR_MESSAGES.FETCH_ERROR)
    console.error("Error fetching active radio adverts:", error)
    throw new Error(`Помилка при отриманні активних рекламних роликів: ${errorMessage}`)
  }

  return data as RadioAdvert[]
}

// Отримання рекламного ролика за ID
export async function getRadioAdvertById(id: string): Promise<RadioAdvert> {
  const supabase = createClient()

  const { data, error } = await supabase.from("radio_adverts").select("*").eq("id", id).single()

  if (error) {
    const errorMessage = handleSupabaseError(error, ERROR_MESSAGES.FETCH_ERROR)
    console.error("Error fetching radio advert:", error)
    throw new Error(`Помилка при отриманні рекламного ролика: ${errorMessage}`)
  }

  return data as RadioAdvert
}

// Створення нового рекламного ролика
export async function createRadioAdvert(
  advert: Omit<RadioAdvert, "id" | "playCount" | "lastUpdated">,
): Promise<RadioAdvert> {
  const supabase = createClient()

  const newAdvert = {
    ...advert,
    playCount: 0,
    lastUpdated: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("radio_adverts").insert(newAdvert).select().single()

  if (error) {
    const errorMessage = handleSupabaseError(error, ERROR_MESSAGES.CREATE_ERROR)
    console.error("Error creating radio advert:", error)
    throw new Error(`Помилка при створенні рекламного ролика: ${errorMessage}`)
  }

  return data as RadioAdvert
}

// Оновлення рекламного ролика
export async function updateRadioAdvert(
  id: string,
  advert: Partial<Omit<RadioAdvert, "id" | "lastUpdated">>,
): Promise<RadioAdvert> {
  const supabase = createClient()

  const updatedAdvert = {
    ...advert,
    lastUpdated: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("radio_adverts").update(updatedAdvert).eq("id", id).select().single()

  if (error) {
    const errorMessage = handleSupabaseError(error, ERROR_MESSAGES.UPDATE_ERROR)
    console.error("Error updating radio advert:", error)
    throw new Error(`Помилка при оновленні рекламного ролика: ${errorMessage}`)
  }

  return data as RadioAdvert
}

// Видалення рекламного ролика
export async function deleteRadioAdvert(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("radio_adverts").delete().eq("id", id)

  if (error) {
    const errorMessage = handleSupabaseError(error, ERROR_MESSAGES.DELETE_ERROR)
    console.error("Error deleting radio advert:", error)
    throw new Error(`Помилка при видаленні рекламного ролика: ${errorMessage}`)
  }
}

// Збільшення лічильника відтворень
export async function incrementAdvertPlayCount(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.rpc("increment_advert_play_count", { advert_id: id })

  if (error) {
    console.error("Error incrementing play count:", error)
    // Не викидаємо помилку, щоб не переривати відтворення
  }
}

// Отримання налаштувань реклами
export async function getRadioAdvertSettings(): Promise<RadioAdvertSettings> {
  const supabase = createClient()

  const { data, error } = await supabase.from("radio_advert_settings").select("*").single()

  if (error) {
    console.error("Error fetching radio advert settings:", error)
    // Повертаємо значення за замовчуванням у разі помилки
    return {
      enabled: true,
      playBeforeStream: true,
      rotateAdverts: true,
      skipEnabled: true,
      skipAfterSeconds: 5,
      sessionTimeout: 60, // 60 хвилин
    }
  }

  return data as RadioAdvertSettings
}

// Оновлення налаштувань реклами
export async function updateRadioAdvertSettings(settings: Partial<RadioAdvertSettings>): Promise<RadioAdvertSettings> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("radio_advert_settings")
    .update(settings)
    .eq("id", "1") // Припускаємо, що у нас тільки один запис налаштувань з id=1
    .select()
    .single()

  if (error) {
    const errorMessage = handleSupabaseError(error, ERROR_MESSAGES.UPDATE_ERROR)
    console.error("Error updating radio advert settings:", error)
    throw new Error(`Помилка при оновленні налаштувань реклами: ${errorMessage}`)
  }

  return data as RadioAdvertSettings
}

// Перевірка відповідності таргетування
function matchesTargeting(advert: RadioAdvert, userData: UserTargetingData): boolean {
  // Якщо немає таргетування, реклама підходить всім
  if (!advert.targeting) {
    return true
  }

  const targeting = advert.targeting

  // Перевірка типу пристрою
  if (targeting.devices && targeting.devices.length > 0) {
    if (!userData.deviceType || !targeting.devices.includes(userData.deviceType)) {
      return false
    }
  }

  // Перевірка браузера
  if (targeting.browsers && targeting.browsers.length > 0) {
    if (!userData.browser || !targeting.browsers.includes(userData.browser.toLowerCase())) {
      return false
    }
  }

  // Перевірка країни
  if (targeting.countries && targeting.countries.length > 0) {
    if (!userData.country || !targeting.countries.includes(userData.country)) {
      return false
    }
  }

  // Перевірка регіону
  if (targeting.regions && targeting.regions.length > 0) {
    if (!userData.region || !targeting.regions.includes(userData.region)) {
      return false
    }
  }

  // Перевірка міста
  if (targeting.cities && targeting.cities.length > 0) {
    if (!userData.city || !targeting.cities.includes(userData.city)) {
      return false
    }
  }

  // Перевірка мови
  if (targeting.languages && targeting.languages.length > 0) {
    if (!userData.language || !targeting.languages.includes(userData.language)) {
      return false
    }
  }

  // Перевірка дня тижня
  if (targeting.daysOfWeek && targeting.daysOfWeek.length > 0) {
    if (userData.dayOfWeek === undefined || !targeting.daysOfWeek.includes(userData.dayOfWeek)) {
      return false
    }
  }

  // Перевірка часу доби
  if (targeting.timeOfDay && targeting.timeOfDay.length > 0) {
    if (!userData.timeOfDay) {
      return false
    }

    const currentTime = userData.timeOfDay
    let matchesTimeOfDay = false

    for (const timeRange of targeting.timeOfDay) {
      if (isTimeInRange(currentTime, timeRange.startTime, timeRange.endTime)) {
        matchesTimeOfDay = true
        break
      }
    }

    if (!matchesTimeOfDay) {
      return false
    }
  }

  // Перевірка групи користувачів
  if (targeting.userGroups && targeting.userGroups.length > 0) {
    if (!userData.userGroup || !targeting.userGroups.includes(userData.userGroup)) {
      return false
    }
  }

  // Перевірка вікової групи
  if (targeting.ageGroups && targeting.ageGroups.length > 0) {
    if (!userData.ageGroup || !targeting.ageGroups.includes(userData.ageGroup)) {
      return false
    }
  }

  // Перевірка статі
  if (targeting.gender && targeting.gender.length > 0) {
    if (!userData.gender || !targeting.gender.includes(userData.gender)) {
      return false
    }
  }

  // Перевірка інтересів
  if (targeting.interests && targeting.interests.length > 0) {
    if (!userData.interests || !userData.interests.some((interest) => targeting.interests!.includes(interest))) {
      return false
    }
  }

  // Перевірка програми
  if (targeting.programs && targeting.programs.length > 0) {
    if (!userData.listeningProgram || !targeting.programs.includes(userData.listeningProgram)) {
      return false
    }
  }

  // Якщо всі перевірки пройдені, реклама підходить
  return true
}

// Допоміжна функція для перевірки, чи входить час у діапазон
function isTimeInRange(time: string, startTime: string, endTime: string): boolean {
  const timeMinutes = convertTimeToMinutes(time)
  const startMinutes = convertTimeToMinutes(startTime)
  let endMinutes = convertTimeToMinutes(endTime)

  // Якщо кінцевий час менший за початковий, це означає, що діапазон переходить через північ
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60 // Додаємо 24 години
  }

  return timeMinutes >= startMinutes && timeMinutes <= endMinutes
}

// Допоміжна функція для конвертації часу у хвилини
function convertTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

// Отримання наступного рекламного ролика для відтворення з урахуванням таргетування
export async function getNextAdvertToPlay(userData: UserTargetingData): Promise<RadioAdvert | null> {
  try {
    const settings = await getRadioAdvertSettings()

    if (!settings.enabled) {
      return null
    }

    const adverts = await getActiveRadioAdverts()

    if (adverts.length === 0) {
      return null
    }

    // Фільтруємо ролики за таргетуванням
    const matchingAdverts = adverts.filter((advert) => matchesTargeting(advert, userData))

    if (matchingAdverts.length === 0) {
      return null
    }

    // Якщо увімкнено ротацію, вибираємо випадковий ролик з урахуванням пріоритету
    if (settings.rotateAdverts) {
      // Створюємо масив, де кожен ролик повторюється відповідно до його пріоритету
      const weightedAdverts = matchingAdverts.flatMap((advert) => Array(advert.priority).fill(advert))

      // Вибираємо випадковий ролик
      const randomIndex = Math.floor(Math.random() * weightedAdverts.length)
      return weightedAdverts[randomIndex]
    }

    // Якщо ротація вимкнена, повертаємо ролик з найвищим пріоритетом
    return matchingAdverts[0]
  } catch (error) {
    console.error("Error getting next advert to play:", error)
    return null
  }
}

// Отримання даних користувача для таргетування з запиту
export function getUserTargetingDataFromRequest(req: Request): UserTargetingData {
  const headers = new Headers(req.headers)
  const userAgent = headers.get("user-agent") || ""
  const acceptLanguage = headers.get("accept-language") || ""
  const ip = headers.get("x-forwarded-for") || headers.get("x-real-ip") || ""

  // Визначення типу пристрою на основі User-Agent
  let deviceType: "desktop" | "mobile" | "tablet" | "unknown" = DEVICE_TYPES.UNKNOWN
  if (userAgent) {
    if (/mobile/i.test(userAgent)) {
      deviceType = DEVICE_TYPES.MOBILE
    } else if (/tablet|ipad/i.test(userAgent)) {
      deviceType = DEVICE_TYPES.TABLET
    } else if (/windows|macintosh|linux/i.test(userAgent)) {
      deviceType = DEVICE_TYPES.DESKTOP
    }
  }

  // Визначення браузера
  let browser = BROWSERS.UNKNOWN
  if (userAgent) {
    if (/chrome/i.test(userAgent)) {
      browser = BROWSERS.CHROME
    } else if (/firefox/i.test(userAgent)) {
      browser = BROWSERS.FIREFOX
    } else if (/safari/i.test(userAgent)) {
      browser = BROWSERS.SAFARI
    } else if (/edge/i.test(userAgent)) {
      browser = BROWSERS.EDGE
    } else if (/opera|opr/i.test(userAgent)) {
      browser = BROWSERS.OPERA
    } else if (/msie|trident/i.test(userAgent)) {
      browser = BROWSERS.IE
    }
  }

  // Визначення мови
  let language = "unknown"
  if (acceptLanguage) {
    language = acceptLanguage.split(",")[0].split("-")[0]
  }

  // Визначення поточного часу та дня тижня
  const now = new Date()
  const timeOfDay = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
  const dayOfWeek = now.getDay() // 0 - неділя, 6 - субота

  // Тут можна додати логіку для визначення країни, регіону та міста за IP
  // Для цього потрібно використовувати сторонній сервіс геолокації

  return {
    deviceType,
    browser,
    language,
    timeOfDay,
    dayOfWeek,
    // Інші поля можуть бути заповнені з даних користувача, якщо він авторизований
  }
}

