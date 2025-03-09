export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для рекомендованих плейлистів
  const playlists = [
    {
      id: "1",
      title: "Рекомендований плейлист 1",
      description: "Опис плейлиста 1",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 15,
    },
    {
      id: "2",
      title: "Рекомендований плейлист 2",
      description: "Опис плейлиста 2",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 20,
    },
  ]

  return NextResponse.json(playlists)
}

