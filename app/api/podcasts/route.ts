export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для подкастів
  const podcasts = [
    {
      id: "1",
      title: "Подкаст 1",
      description: "Опис подкасту 1",
      image: "/placeholder.svg?height=300&width=300",
      episodes: 10,
      host: "Ведучий 1",
    },
    {
      id: "2",
      title: "Подкаст 2",
      description: "Опис подкасту 2",
      image: "/placeholder.svg?height=300&width=300",
      episodes: 5,
      host: "Ведучий 2",
    },
  ]

  return NextResponse.json(podcasts)
}

