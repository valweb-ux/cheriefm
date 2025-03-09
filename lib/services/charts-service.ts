import { createClient } from "@/lib/supabase/server"
import type {
  Chart,
  ChartInsert,
  ChartUpdate,
  ChartEntry,
  ChartEntryInsert,
  ChartEntryUpdate,
} from "@/types/music.types"

export async function getCharts(
  page = 1,
  limit = 10,
  search = "",
  onlyActive = false,
): Promise<{ data: Chart[]; count: number }> {
  const supabase = createClient()

  // Розрахунок відступу для пагінації
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Базовий запит
  let query = supabase
    .from("charts")
    .select("*", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(from, to)

  // Додаємо фільтр пошуку, якщо він є
  if (search) {
    query = query.or(`title_uk.ilike.%${search}%,description_uk.ilike.%${search}%`)
  }

  // Фільтр за активними чартами
  if (onlyActive) {
    query = query.eq("is_active", true)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching charts:", error)
    throw new Error(`Помилка при отриманні чартів: ${error.message}`)
  }

  return {
    data: data as Chart[],
    count: count || 0,
  }
}

export async function getChartById(id: string): Promise<Chart> {
  const supabase = createClient()

  const { data, error } = await supabase.from("charts").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching chart by ID:", error)
    throw new Error(`Помилка при отриманні чарту: ${error.message}`)
  }

  return data as Chart
}

export async function getChartBySlug(slug: string): Promise<Chart | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("charts").select("*").eq("slug", slug).eq("is_active", true).single()

  if (error) {
    if (error.code === "PGRST116") {
      // Чарт не знайдений
      return null
    }
    console.error("Error fetching chart by slug:", error)
    throw new Error(`Помилка при отриманні чарту: ${error.message}`)
  }

  return data as Chart
}

export async function createChart(chart: ChartInsert): Promise<Chart> {
  const supabase = createClient()

  // Додаємо поточну дату до created_at та updated_at
  const chartWithDates = {
    ...chart,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_updated: null,
  }

  const { data, error } = await supabase.from("charts").insert(chartWithDates).select().single()

  if (error) {
    console.error("Error creating chart:", error)
    throw new Error(`Помилка при створенні чарту: ${error.message}`)
  }

  return data as Chart
}

export async function updateChart(id: string, chart: ChartUpdate): Promise<Chart> {
  const supabase = createClient()

  // Додаємо поточну дату до updated_at
  const chartWithDate = {
    ...chart,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("charts").update(chartWithDate).eq("id", id).select().single()

  if (error) {
    console.error("Error updating chart:", error)
    throw new Error(`Помилка при оновленні чарту: ${error.message}`)
  }

  return data as Chart
}

export async function deleteChart(id: string): Promise<void> {
  const supabase = createClient()

  // Спочатку видаляємо всі записи з чарту
  const { error: entriesError } = await supabase.from("chart_entries").delete().eq("chart_id", id)

  if (entriesError) {
    console.error("Error deleting chart entries:", entriesError)
    throw new Error(`Помилка при видаленні записів чарту: ${entriesError.message}`)
  }

  // Потім видаляємо сам чарт
  const { error } = await supabase.from("charts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting chart:", error)
    throw new Error(`Помилка при видаленні чарту: ${error.message}`)
  }
}

export async function getChartEntries(chartId: string): Promise<ChartEntry[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("chart_entries")
    .select("*, tracks(*, artists(*))")
    .eq("chart_id", chartId)
    .order("position", { ascending: true })

  if (error) {
    console.error("Error fetching chart entries:", error)
    throw new Error(`Помилка при отриманні записів чарту: ${error.message}`)
  }

  // Трансформуємо дані для зручності використання
  const transformedData = data.map((item) => {
    if (item.tracks) {
      const track = {
        ...item.tracks,
        artist: item.tracks.artists,
        artists: undefined,
      }

      return {
        ...item,
        track,
        tracks: undefined,
      }
    }
    return item
  }) as ChartEntry[]

  return transformedData
}

export async function addTrackToChart(chartEntry: ChartEntryInsert): Promise<ChartEntry> {
  const supabase = createClient()

  // Перевіряємо, чи вже є трек у чарті
  const { data: existingEntry, error: checkError } = await supabase
    .from("chart_entries")
    .select("*")
    .eq("chart_id", chartEntry.chart_id)
    .eq("track_id", chartEntry.track_id)
    .maybeSingle()

  if (checkError) {
    console.error("Error checking existing entry:", checkError)
    throw new Error(`Помилка при перевірці запису: ${checkError.message}`)
  }

  if (existingEntry) {
    throw new Error("Цей трек вже є в чарті")
  }

  // Додаємо трек до чарту
  const { data, error } = await supabase.from("chart_entries").insert(chartEntry).select().single()

  if (error) {
    console.error("Error adding track to chart:", error)
    throw new Error(`Помилка при додаванні треку до чарту: ${error.message}`)
  }

  // Оновлюємо дату оновлення чарту
  await supabase
    .from("charts")
    .update({
      updated_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
    })
    .eq("id", chartEntry.chart_id)

  return data as ChartEntry
}

export async function updateChartEntry(
  chartId: string,
  trackId: string,
  updates: ChartEntryUpdate,
): Promise<ChartEntry> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("chart_entries")
    .update(updates)
    .eq("chart_id", chartId)
    .eq("track_id", trackId)
    .select()
    .single()

  if (error) {
    console.error("Error updating chart entry:", error)
    throw new Error(`Помилка при оновленні запису чарту: ${error.message}`)
  }

  // Оновлюємо дату оновлення чарту
  await supabase
    .from("charts")
    .update({
      updated_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
    })
    .eq("id", chartId)

  return data as ChartEntry
}

export async function removeTrackFromChart(chartId: string, trackId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("chart_entries").delete().eq("chart_id", chartId).eq("track_id", trackId)

  if (error) {
    console.error("Error removing track from chart:", error)
    throw new Error(`Помилка при видаленні треку з чарту: ${error.message}`)
  }

  // Оновлюємо дату оновлення чарту
  await supabase
    .from("charts")
    .update({
      updated_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
    })
    .eq("id", chartId)
}

export async function updateChartPositions(chartId: string): Promise<void> {
  const supabase = createClient()

  // Отримуємо поточні записи чарту
  const { data: currentEntries, error: fetchError } = await supabase
    .from("chart_entries")
    .select("*")
    .eq("chart_id", chartId)
    .order("position", { ascending: true })

  if (fetchError) {
    console.error("Error fetching chart entries:", fetchError)
    throw new Error(`Помилка при отриманні записів чарту: ${fetchError.message}`)
  }

  // Оновлюємо previous_position для кожного запису
  for (const entry of currentEntries) {
    const { error: updateError } = await supabase
      .from("chart_entries")
      .update({ previous_position: entry.position })
      .eq("id", entry.id)

    if (updateError) {
      console.error("Error updating previous position:", updateError)
      throw new Error(`Помилка при оновленні попередньої позиції: ${updateError.message}`)
    }
  }

  // Оновлюємо дату оновлення чарту
  await supabase
    .from("charts")
    .update({
      updated_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
    })
    .eq("id", chartId)
}

export async function getActiveCharts(): Promise<Chart[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("charts")
    .select("*")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching active charts:", error)
    throw new Error(`Помилка при отриманні активних чартів: ${error.message}`)
  }

  return data as Chart[]
}

