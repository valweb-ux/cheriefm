export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для новини
  const news = {
    id,
    title: "Новина " + id,
    content: "Повний текст новини " + id,
    image: "/placeholder.svg?height=300&width=300",
    category: "Музика",
    date: new Date().toISOString(),
    author: "Автор",
    tags: ["музика", "новини", "радіо"],
  }

  return NextResponse.json(news)
}

