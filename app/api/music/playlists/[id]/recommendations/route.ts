export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для рекомендацій на основі плейлиста
  const recommendations = {
    tracks: [
      {
        id: "1",
        title: "Рекомендована пісня 1",
        artist: "Виконавець 1",
        album: "Альбом 1",
        coverUrl: "/placeholder.svg?height=300&width=300",
        duration: "3:45",
      },
      {
        id: "2",
        title: "Рекомендована пісня 2",
        artist: "Виконавець 2",
        album: "Альбом 2",
        coverUrl: "/placeholder.svg?height=300&width=300",
        duration: "4:20",
      },
    ],
    playlists: [
      {
        id: "1",
        title: "Схожий плейлист 1",
        description: "Опис плейлиста 1",
        image: "/placeholder.svg?height=300&width=300",
        tracks: 15,
      },
      {
        id: "2",
        title: "Схожий плейлист 2",
        description: "Опис плейлиста 2",
        image: "/placeholder.svg?height=300&width=300",
        tracks: 20,
      },
    ],
  }

  return NextResponse.json(recommendations)
}

