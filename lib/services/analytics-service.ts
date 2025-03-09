"use server"

import { createClient } from "@/lib/supabase/server"
import type {
  AnalyticsDashboardData,
  SeoSettings,
  SeoSettingsUpdate,
  PageSeoData,
  PageSeoDataUpdate,
} from "@/types/analytics.types"
import { headers } from "next/headers"

// Функції для роботи з аналітикою
export async function recordPageView(pagePath: string, sessionId: string | null = null): Promise<void> {
  const supabase = createClient()
  const headersList = headers()

  const userAgent = headersList.get("user-agent") || null
  const referer = headersList.get("referer") || null
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || null

  // Визначення типу пристрою на основі User-Agent
  let deviceType: "desktop" | "mobile" | "tablet" | "unknown" = "unknown"
  if (userAgent) {
    if (/mobile/i.test(userAgent)) {
      deviceType = "mobile"
    } else if (/tablet|ipad/i.test(userAgent)) {
      deviceType = "tablet"
    } else if (/windows|macintosh|linux/i.test(userAgent)) {
      deviceType = "desktop"
    }
  }

  // Визначення браузера
  let browser = null
  if (userAgent) {
    if (/chrome/i.test(userAgent)) {
      browser = "Chrome"
    } else if (/firefox/i.test(userAgent)) {
      browser = "Firefox"
    } else if (/safari/i.test(userAgent)) {
      browser = "Safari"
    } else if (/edge/i.test(userAgent)) {
      browser = "Edge"
    } else if (/opera|opr/i.test(userAgent)) {
      browser = "Opera"
    } else if (/msie|trident/i.test(userAgent)) {
      browser = "Internet Explorer"
    }
  }

  // Запис перегляду сторінки
  const { error } = await supabase.from("page_views").insert({
    page_path: pagePath,
    referrer: referer,
    user_agent: userAgent,
    ip_address: ip,
    session_id: sessionId,
    device_type: deviceType,
    browser: browser,
  })

  if (error) {
    console.error("Error recording page view:", error)
  }
}

export async function recordTrackPlay(
  trackId: string,
  playDuration: number,
  completed: boolean,
  userId: string | null = null,
  sessionId: string | null = null,
): Promise<void> {
  const supabase = createClient()
  const headersList = headers()

  const userAgent = headersList.get("user-agent") || null
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || null

  // Визначення типу пристрою на основі User-Agent
  let deviceType: "desktop" | "mobile" | "tablet" | "unknown" = "unknown"
  if (userAgent) {
    if (/mobile/i.test(userAgent)) {
      deviceType = "mobile"
    } else if (/tablet|ipad/i.test(userAgent)) {
      deviceType = "tablet"
    } else if (/windows|macintosh|linux/i.test(userAgent)) {
      deviceType = "desktop"
    }
  }

  // Запис відтворення треку
  const { error } = await supabase.from("track_plays").insert({
    track_id: trackId,
    user_id: userId,
    session_id: sessionId,
    play_duration: playDuration,
    completed: completed,
    ip_address: ip,
    device_type: deviceType,
  })

  if (error) {
    console.error("Error recording track play:", error)
  }
}

export async function recordRadioListening(
  programId: string | null,
  listenDuration: number,
  userId: string | null = null,
  sessionId: string | null = null,
): Promise<void> {
  const supabase = createClient()
  const headersList = headers()

  const userAgent = headersList.get("user-agent") || null
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || null

  // Визначення типу пристрою на основі User-Agent
  let deviceType: "desktop" | "mobile" | "tablet" | "unknown" = "unknown"
  if (userAgent) {
    if (/mobile/i.test(userAgent)) {
      deviceType = "mobile"
    } else if (/tablet|ipad/i.test(userAgent)) {
      deviceType = "tablet"
    } else if (/windows|macintosh|linux/i.test(userAgent)) {
      deviceType = "desktop"
    }
  }

  // Запис прослуховування радіо
  const { error } = await supabase.from("radio_listening").insert({
    program_id: programId,
    user_id: userId,
    session_id: sessionId,
    listen_duration: listenDuration,
    ip_address: ip,
    device_type: deviceType,
  })

  if (error) {
    console.error("Error recording radio listening:", error)
  }
}

export async function getAnalyticsDashboardData(startDate: string, endDate: string): Promise<AnalyticsDashboardData> {
  const supabase = createClient()

  // Отримання загальної кількості переглядів сторінок
  const { count: totalPageViews, error: pageViewsError } = await supabase
    .from("page_views")
    .select("*", { count: "exact" })
    .gte("created_at", startDate)
    .lte("created_at", endDate)

  if (pageViewsError) {
    console.error("Error getting page views count:", pageViewsError)
  }

  // Отримання кількості унікальних відвідувачів
  const { data: uniqueVisitorsData, error: uniqueVisitorsError } = await supabase
    .from("page_views")
    .select("session_id")
    .gte("created_at", startDate)
    .lte("created_at", endDate)

  if (uniqueVisitorsError) {
    console.error("Error getting unique visitors:", uniqueVisitorsError)
  }

  // Підрахунок унікальних session_id
  const uniqueSessionIds = new Set()
  uniqueVisitorsData?.forEach((item) => {
    if (item.session_id) {
      uniqueSessionIds.add(item.session_id)
    }
  })

  // Отримання кількості відтворень треків
  const { count: trackPlays, error: trackPlaysError } = await supabase
    .from("track_plays")
    .select("*", { count: "exact" })
    .gte("created_at", startDate)
    .lte("created_at", endDate)

  if (trackPlaysError) {
    console.error("Error getting track plays count:", trackPlaysError)
  }

  // Отримання загального часу прослуховування радіо
  const { data: radioListeningData, error: radioListeningError } = await supabase
    .from("radio_listening")
    .select("listen_duration")
    .gte("created_at", startDate)
    .lte("created_at", endDate)

  if (radioListeningError) {
    console.error("Error getting radio listening data:", radioListeningError)
  }

  const radioListeningTime = radioListeningData?.reduce((total, item) => total + (item.listen_duration || 0), 0) || 0

  // Отримання переглядів сторінок по днях
  const { data: pageViewsByDayData, error: pageViewsByDayError } = await supabase.rpc("get_page_views_by_day", {
    start_date: startDate,
    end_date: endDate,
  })

  if (pageViewsByDayError) {
    console.error("Error getting page views by day:", pageViewsByDayError)
  }

  // Отримання топ треків
  const { data: topTracksData, error: topTracksError } = await supabase.rpc("get_top_tracks", {
    start_date: startDate,
    end_date: endDate,
    limit_count: 10,
  })

  if (topTracksError) {
    console.error("Error getting top tracks:", topTracksError)
  }

  // Отримання топ сторінок
  const { data: topPagesData, error: topPagesError } = await supabase.rpc("get_top_pages", {
    start_date: startDate,
    end_date: endDate,
    limit_count: 10,
  })

  if (topPagesError) {
    console.error("Error getting top pages:", topPagesError)
  }

  // Отримання розподілу за пристроями
  const { data: deviceDistributionData, error: deviceDistributionError } = await supabase.rpc(
    "get_device_distribution",
    { start_date: startDate, end_date: endDate },
  )

  if (deviceDistributionError) {
    console.error("Error getting device distribution:", deviceDistributionError)
  }

  // Отримання розподілу за країнами
  const { data: countryDistributionData, error: countryDistributionError } = await supabase.rpc(
    "get_country_distribution",
    { start_date: startDate, end_date: endDate, limit_count: 10 },
  )

  if (countryDistributionError) {
    console.error("Error getting country distribution:", countryDistributionError)
  }

  return {
    totalPageViews: totalPageViews || 0,
    uniqueVisitors: uniqueSessionIds.size,
    trackPlays: trackPlays || 0,
    radioListeningTime: radioListeningTime,
    pageViewsByDay: pageViewsByDayData || [],
    topTracks: topTracksData || [],
    topPages: topPagesData || [],
    deviceDistribution: deviceDistributionData || [],
    countryDistribution: countryDistributionData || [],
  }
}

// Функції для роботи з SEO налаштуваннями
export async function getSeoSettings(): Promise<SeoSettings> {
  const supabase = createClient()

  const { data, error } = await supabase.from("seo_settings").select("*").single()

  if (error) {
    console.error("Error fetching SEO settings:", error)
    throw new Error(`Помилка при отриманні SEO налаштувань: ${error.message}`)
  }

  return data as SeoSettings
}

export async function updateSeoSettings(settings: SeoSettingsUpdate): Promise<SeoSettings> {
  const supabase = createClient()

  // Додаємо поточну дату до updated_at
  const settingsWithDate = {
    ...settings,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("seo_settings")
    .update(settingsWithDate)
    .eq("id", "1") // Припускаємо, що у нас тільки один запис налаштувань з id=1
    .select()
    .single()

  if (error) {
    console.error("Error updating SEO settings:", error)
    throw new Error(`Помилка при оновленні SEO налаштувань: ${error.message}`)
  }

  return data as SeoSettings
}

export async function getPageSeoData(pageType: string, pagePath?: string): Promise<PageSeoData | null> {
  const supabase = createClient()

  let query = supabase.from("page_seo_data").select("*").eq("page_type", pageType)

  if (pagePath) {
    query = query.eq("page_path", pagePath)
  }

  const { data, error } = await query.maybeSingle()

  if (error) {
    console.error("Error fetching page SEO data:", error)
    return null
  }

  return data as PageSeoData | null
}

export async function updatePageSeoData(id: string, data: PageSeoDataUpdate): Promise<PageSeoData> {
  const supabase = createClient()

  // Додаємо поточну дату до updated_at
  const dataWithDate = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  const { data: updatedData, error } = await supabase
    .from("page_seo_data")
    .update(dataWithDate)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating page SEO data:", error)
    throw new Error(`Помилка при оновленні SEO даних сторінки: ${error.message}`)
  }

  return updatedData as PageSeoData
}

export async function createPageSeoData(data: PageSeoDataUpdate): Promise<PageSeoData> {
  const supabase = createClient()

  // Додаємо поточні дати
  const dataWithDates = {
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data: createdData, error } = await supabase.from("page_seo_data").insert(dataWithDates).select().single()

  if (error) {
    console.error("Error creating page SEO data:", error)
    throw new Error(`Помилка при створенні SEO даних сторінки: ${error.message}`)
  }

  return createdData as PageSeoData
}

