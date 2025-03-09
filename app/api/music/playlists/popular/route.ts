export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для популярних плейлистів
  const playlists = [
    {
      id: "1",
      title: "Популярний плейлист 1",
      description: "Опис плейлиста 1",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 15,
      plays: 1000,
    },
    {
      id: "2",
      title: "Популярний плейлист 2",
      description: "Опис плейлиста 2",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 20,
      plays: 800,
    },
  ]

  return NextResponse.json(playlists)
}

