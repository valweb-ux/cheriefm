export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для чарту
  const chart = {
    id,
    title: "Чарт " + id,
    description: "Опис чарту " + id,
    image: "/placeholder.svg?height=300&width=300",
    tracks: [
      {
        id: "1",
        position: 1,
        title: "Пісня 1",
        artist: "Виконавець 1",
        album: "Альбом 1",
        coverUrl: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "2",
        position: 2,
        title: "Пісня 2",
        artist: "Виконавець 2",
        album: "Альбом 2",
        coverUrl: "/placeholder.svg?height=300&width=300",
      },
    ],
  }

  return NextResponse.json(chart)
}

