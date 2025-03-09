export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для треку
  const track = {
    id,
    title: "Пісня " + id,
    artist: "Артист",
    album: "Альбом",
    coverUrl: "/placeholder.svg?height=300&width=300",
    duration: "3:45",
    releaseDate: new Date().toISOString(),
    lyrics: "Текст пісні...",
  }

  return NextResponse.json(track)
}

