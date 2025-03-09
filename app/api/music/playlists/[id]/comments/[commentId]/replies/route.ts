export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string; commentId: string } }) {
  const { id, commentId } = params

  // Статична заглушка для відповідей на коментар до плейлиста
  const replies = [
    {
      id: "1",
      content: "Відповідь 1",
      author: "Користувач 1",
      authorAvatar: "/placeholder.svg?height=50&width=50",
      createdAt: new Date().toISOString(),
      likes: 2,
    },
    {
      id: "2",
      content: "Відповідь 2",
      author: "Користувач 2",
      authorAvatar: "/placeholder.svg?height=50&width=50",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 1,
    },
  ]

  return NextResponse.json(replies)
}

export async function POST() {
  // Статична заглушка для додавання відповіді на коментар до плейлиста
  return NextResponse.json({ success: true, id: Date.now().toString() })
}

