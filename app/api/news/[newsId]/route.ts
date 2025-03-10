import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic" // Змінюємо на динамічний режим для отримання актуальних даних

export async function GET(request: Request, { params }: { params: { newsId: string } }) {
  try {
    const id = params.newsId
    const supabase = createClient()

    // Спробуємо отримати новину з бази даних
    const { data, error } = await supabase.from("news").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching news with id ${id}:`, error)
      return NextResponse.json({ error: "News not found", details: error.message }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error(`Unexpected error in news API for ${params.newsId}:`, err)
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    )
  }
}

