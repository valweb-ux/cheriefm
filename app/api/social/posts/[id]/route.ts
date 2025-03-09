export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для соціального поста
  const post = {
    id,
    content: "Пост " + id,
    author: "Користувач",
    authorAvatar: "/placeholder.svg?height=50&width=50",
    createdAt: new Date().toISOString(),
    likes: 10,
    comments: 5,
    shares: 2,
  }

  return NextResponse.json(post)
}

export async function PUT() {
  // Статична заглушка для оновлення поста
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  // Статична заглушка для видалення поста
  return NextResponse.json({ success: true })
}

