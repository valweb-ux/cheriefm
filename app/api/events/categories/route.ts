export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для категорій подій
  const categories = [
    { id: "1", name: "Концерти", slug: "concerts" },
    { id: "2", name: "Фестивалі", slug: "festivals" },
    { id: "3", name: "Вечірки", slug: "parties" },
  ]

  return NextResponse.json(categories)
}

