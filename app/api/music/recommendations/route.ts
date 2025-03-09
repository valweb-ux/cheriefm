export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для рекомендованих треків
  const recommendations = [
    {
      id: "1",
      title: "Рекомендована пісня 1",
      artist: "Артист 1",
      album: "Альбом 1",
      coverUrl: "/placeholder.svg?height=300&width=300",
      duration: "3:45",
    },
    {
      id: "2",
      title: "Рекомендована пісня 2",
      artist: "Артист 2",
      album: "Альбом 2",
      coverUrl: "/placeholder.svg?height=300&width=300",
      duration: "4:20",
    },
  ]

  return NextResponse.json(recommendations)
}

