export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для нових плейлистів
  const playlists = [
    {
      id: "1",
      title: "Новий плейлист 1",
      description: "Опис плейлиста 1",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 15,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Новий плейлист 2",
      description: "Опис плейлиста 2",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 20,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return NextResponse.json(playlists)
}

