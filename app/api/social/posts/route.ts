export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для соціальних постів
  const posts = [
    {
      id: "1",
      content: "Пост 1",
      author: "Користувач 1",
      authorAvatar: "/placeholder.svg?height=50&width=50",
      createdAt: new Date().toISOString(),
      likes: 10,
      comments: 5,
      shares: 2,
    },
    {
      id: "2",
      content: "Пост 2",
      author: "Користувач 2",
      authorAvatar: "/placeholder.svg?height=50&width=50",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      likes: 5,
      comments: 2,
      shares: 1,
    },
  ]

  return NextResponse.json(posts)
}

export async function POST() {
  // Статична заглушка для створення поста
  return NextResponse.json({ success: true, id: Date.now().toString() })
}

