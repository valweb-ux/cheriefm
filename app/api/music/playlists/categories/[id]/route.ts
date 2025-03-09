export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для категорії плейлистів
  const category = {
    id,
    name: "Категорія " + id,
    description: "Опис категорії " + id,
    image: "/placeholder.svg?height=300&width=300",
    playlists: [
      {
        id: "1",
        title: "Плейлист 1",
        description: "Опис плейлиста 1",
        image: "/placeholder.svg?height=300&width=300",
        tracks: 15,
      },
      {
        id: "2",
        title: "Плейлист 2",
        description: "Опис плейлиста 2",
        image: "/placeholder.svg?height=300&width=300",
        tracks: 20,
      },
    ],
  }

  return NextResponse.json(category)
}

