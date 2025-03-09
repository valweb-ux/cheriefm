export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для коментарів
  const comments = [
    {
      id: "1",
      content: "Коментар 1",
      author: "Користувач 1",
      authorAvatar: "/placeholder.svg?height=50&width=50",
      createdAt: new Date().toISOString(),
      likes: 5,
    },
    {
      id: "2",
      content: "Коментар 2",
      author: "Користувач 2",
      authorAvatar: "/placeholder.svg?height=50&width=50",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      likes: 2,
    },
  ]

  return NextResponse.json(comments)
}

export async function POST() {
  // Статична заглушка для створення коментаря
  return NextResponse.json({ success: true, id: Date.now().toString() })
}

