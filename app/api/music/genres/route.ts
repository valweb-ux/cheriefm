export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для жанрів
  const genres = [
    { id: "1", name: "Поп", slug: "pop" },
    { id: "2", name: "Рок", slug: "rock" },
    { id: "3", name: "Джаз", slug: "jazz" },
    { id: "4", name: "Електронна", slug: "electronic" },
  ]

  return NextResponse.json(genres)
}

