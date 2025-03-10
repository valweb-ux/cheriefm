import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic" // Змінюємо на динамічний режим для отримання актуальних даних

export async function GET() {
  try {
    const supabase = createClient()

    // Спробуємо отримати новини з бази даних
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false })

    if (error) {
      console.error("Error fetching news:", error)
      return NextResponse.json({ error: "Failed to fetch news", details: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error("Unexpected error in news API:", err)
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    )
  }
}

