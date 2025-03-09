export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для артиста
  const artist = {
    id,
    name: "Артист " + id,
    bio: "Біографія артиста " + id,
    image: "/placeholder.svg?height=300&width=300",
    tracks: [
      {
        id: "1",
        title: "Пісня 1",
        album: "Альбом 1",
        coverUrl: "/placeholder.svg?height=300&width=300",
        duration: "3:45",
      },
      {
        id: "2",
        title: "Пісня 2",
        album: "Альбом 2",
        coverUrl: "/placeholder.svg?height=300&width=300",
        duration: "4:20",
      },
    ],
  }

  return NextResponse.json(artist)
}

