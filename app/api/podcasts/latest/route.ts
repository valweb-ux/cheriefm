export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для останніх подкастів
  const podcasts = [
    {
      id: "1",
      title: "Новий подкаст 1",
      description: "Опис подкасту 1",
      image: "/placeholder.svg?height=300&width=300",
      episodes: 3,
      host: "Ведучий 1",
      publishedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Новий подкаст 2",
      description: "Опис подкасту 2",
      image: "/placeholder.svg?height=300&width=300",
      episodes: 1,
      host: "Ведучий 2",
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return NextResponse.json(podcasts)
}

