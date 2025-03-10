import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic" // Змінюємо на динамічний режим для отримання актуальних даних

export async function GET() {
  try {
    const supabase = createClient()

    // Спробуємо отримати сторінки з бази даних
    const { data, error } = await supabase.from("pages").select("*").eq("published", true).order("title")

    if (error) {
      console.error("Error fetching pages:", error)

      // Повертаємо статичну заглушку, якщо виникла помилка
      return NextResponse.json([
        {
          id: "1",
          title: "Про нас",
          slug: "about",
          content: "Зміст сторінки про нас",
        },
        {
          id: "2",
          title: "Контакти",
          slug: "contacts",
          content: "Зміст сторінки контактів",
        },
      ])
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error("Unexpected error in site-pages API:", err)
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    )
  }
}

