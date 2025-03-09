export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""

  // Статична заглушка для пошуку плейлистів
  const playlists = [
    {
      id: "1",
      title: "Результат пошуку 1 для " + query,
      description: "Опис плейлиста 1",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 15,
    },
    {
      id: "2",
      title: "Результат пошуку 2 для " + query,
      description: "Опис плейлиста 2",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 20,
    },
  ]

  return NextResponse.json(playlists)
}

