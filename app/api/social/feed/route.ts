export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для стрічки новин
  const feed = [
    {
      id: "1",
      type: "post",
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
      type: "news",
      title: "Новина 1",
      excerpt: "Короткий опис новини 1",
      image: "/placeholder.svg?height=300&width=300",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return NextResponse.json(feed)
}

