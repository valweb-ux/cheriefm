export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для категорій новинних оновлень
  const categories = [
    { id: "1", name: "Політика", slug: "politics" },
    { id: "2", name: "Економіка", slug: "economy" },
    { id: "3", name: "Спорт", slug: "sport" },
    { id: "4", name: "Культура", slug: "culture" },
    { id: "5", name: "Технології", slug: "technology" },
  ]

  return NextResponse.json(categories)
}

