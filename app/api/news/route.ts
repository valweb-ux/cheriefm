import { NextResponse } from "next/server"
import { addNewsAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const { title, content, publish_date, image_url } = await request.json()

    console.log("API: Додавання новини з наступними даними:")
    console.log("Заголовок:", title)
    console.log("Зміст:", content.substring(0, 100) + "...")
    console.log("Дата публікації:", publish_date)
    console.log("URL зображення:", image_url)

    const data = await addNewsAdmin(title, content, publish_date, image_url)

    console.log("API: Новину успішно додано:", data)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("API: Помилка при додаванні новини:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося додати новину" },
      { status: 500 },
    )
  }
}

