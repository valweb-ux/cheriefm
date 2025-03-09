import { type NextRequest, NextResponse } from "next/server"
import { getNews } from "@/lib/supabase/api"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Перевіряємо авторизацію
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 })
    }

    // Отримуємо параметри запиту
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const language = searchParams.get("language") || "uk"

    // Отримуємо дані
    const result = await getNews(page, limit, search, language)

    return NextResponse.json(result)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Помилка сервера" }, { status: 500 })
  }
}

