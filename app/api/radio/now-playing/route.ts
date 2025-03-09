export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для поточного треку
  const nowPlaying = {
    title: "Назва пісні",
    artist: "Виконавець",
    album: "Альбом",
    coverUrl: "/placeholder.svg?height=300&width=300",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
  }

  return NextResponse.json(nowPlaying)
}

