export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для трендів
  const trending = [
    {
      id: "1",
      type: "hashtag",
      name: "#музика",
      count: 100,
    },
    {
      id: "2",
      type: "topic",
      name: "Концерт",
      count: 50,
    },
  ]

  return NextResponse.json(trending)
}

