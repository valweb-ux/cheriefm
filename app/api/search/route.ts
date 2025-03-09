export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""

  // Статична заглушка для пошуку
  const results = [
    {
      id: "1",
      title: "Результат 1 для " + query,
      type: "news",
      url: "/news/1",
    },
    {
      id: "2",
      title: "Результат 2 для " + query,
      type: "program",
      url: "/radio/programs/2",
    },
  ]

  return NextResponse.json(results)
}

