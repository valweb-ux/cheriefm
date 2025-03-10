import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 30 // Оновлювати кеш кожні 30 секунд

export async function GET() {
  try {
    const supabase = createClient()

    // Отримуємо поточний трек з бази даних
    const { data, error } = await supabase.from("radio_info").select("*").single()

    if (error) {
      console.error("Error fetching radio info:", error)
      return NextResponse.json({ error: "Failed to fetch radio info", details: error.message }, { status: 500 })
    }

    // Якщо дані відсутні, повертаємо значення за замовчуванням
    if (!data) {
      return NextResponse.json({
        current_track: "Зараз грає музика",
        title: "Chérie FM",
        stream_url: "https://online.cheriefm.ua/cheriefm",
      })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error("Unexpected error in now-playing API:", err)
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    )
  }
}

