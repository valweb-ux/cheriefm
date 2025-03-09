export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для схожих плейлистів
  const similarPlaylists = [
    {
      id: "1",
      title: "Схожий плейлист 1",
      description: "Опис плейлиста 1",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 15,
      similarity: 0.9,
    },
    {
      id: "2",
      title: "Схожий плейлист 2",
      description: "Опис плейлиста 2",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 20,
      similarity: 0.8,
    },
    {
      id: "3",
      title: "Схожий плейлист 3",
      description: "Опис плейлиста 3",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 12,
      similarity: 0.7,
    },
  ]

  return NextResponse.json(similarPlaylists)
}

