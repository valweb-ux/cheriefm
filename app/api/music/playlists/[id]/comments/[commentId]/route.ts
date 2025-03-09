export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string; commentId: string } }) {
  const { id, commentId } = params

  // Статична заглушка для коментаря до плейлиста
  const comment = {
    id: commentId,
    content: "Коментар " + commentId,
    author: "Користувач",
    authorAvatar: "/placeholder.svg?height=50&width=50",
    createdAt: new Date().toISOString(),
    likes: 5,
    replies: [
      {
        id: "1",
        content: "Відповідь на коментар",
        author: "Інший користувач",
        authorAvatar: "/placeholder.svg?height=50&width=50",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 2,
      },
    ],
  }

  return NextResponse.json(comment)
}

export async function PUT() {
  // Статична заглушка для оновлення коментаря до плейлиста
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  // Статична заглушка для видалення коментаря до плейлиста
  return NextResponse.json({ success: true })
}

