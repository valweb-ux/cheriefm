export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для коментаря
  const comment = {
    id,
    content: "Коментар " + id,
    author: "Користувач",
    authorAvatar: "/placeholder.svg?height=50&width=50",
    createdAt: new Date().toISOString(),
    likes: 5,
    replies: [
      {
        id: "1",
        content: "Відповідь 1",
        author: "Користувач 1",
        authorAvatar: "/placeholder.svg?height=50&width=50",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        likes: 2,
      },
    ],
  }

  return NextResponse.json(comment)
}

export async function PUT() {
  // Статична заглушка для оновлення коментаря
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  // Статична заглушка для видалення коментаря
  return NextResponse.json({ success: true })
}

