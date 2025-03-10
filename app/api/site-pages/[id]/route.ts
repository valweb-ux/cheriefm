import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic" // Змінюємо на динамічний режим для отримання актуальних даних

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createClient()

    // Спробуємо отримати сторінку з бази даних
    const { data, error } = await supabase.from("pages").select("*").eq("slug", id).single()

    if (error) {
      console.error(`Error fetching page with slug ${id}:`, error)

      // Повертаємо статичну заглушку, якщо сторінка не знайдена
      return NextResponse.json({
        id: "1",
        title: "Сторінка " + id,
        slug: id,
        content: "Зміст сторінки " + id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error(`Unexpected error in site-pages API for ${params.id}:`, err)
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    )
  }
}

