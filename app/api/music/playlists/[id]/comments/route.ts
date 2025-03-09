export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для коментарів до плейлиста
  const comments = [
    {
      id: "1",
      content: "Чудовий плейлист!",
      author: "Користувач 1",
      authorAvatar: "/placeholder.svg?height=50&width=50",
      createdAt: new Date().toISOString(),
      likes: 5,
    },
    {
      id: "2",
      content: "Дуже подобається підбірка треків!",
      author: "Користувач 2",
      authorAvatar: "/placeholder.svg?height=50&width=50",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 3,
    },
  ]

  return NextResponse.json(comments)
}

export async function POST() {
  // Статична заглушка для додавання коментаря до плейлиста
  return NextResponse.json({ success: true, id: Date.now().toString() })
}

