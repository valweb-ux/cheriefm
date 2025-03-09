export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для тегів новин
  const tags = [
    { id: "1", name: "музика", count: 10 },
    { id: "2", name: "радіо", count: 8 },
    { id: "3", name: "концерт", count: 5 },
    { id: "4", name: "фестиваль", count: 3 },
  ]

  return NextResponse.json(tags)
}

