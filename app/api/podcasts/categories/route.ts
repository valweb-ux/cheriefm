export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для категорій подкастів
  const categories = [
    { id: "1", name: "Музика", slug: "music" },
    { id: "2", name: "Культура", slug: "culture" },
    { id: "3", name: "Новини", slug: "news" },
  ]

  return NextResponse.json(categories)
}

