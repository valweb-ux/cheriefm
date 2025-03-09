export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для історії користувача
  const history = [
    {
      id: "1",
      type: "track",
      title: "Пісня 1",
      artist: "Артист 1",
      coverUrl: "/placeholder.svg?height=300&width=300",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      type: "news",
      title: "Новина 1",
      image: "/placeholder.svg?height=300&width=300",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return NextResponse.json(history)
}

export async function DELETE() {
  // Статична заглушка для очищення історії
  return NextResponse.json({ success: true })
}

