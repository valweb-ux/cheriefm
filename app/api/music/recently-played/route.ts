export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для нещодавно прослуханих треків
  const recentlyPlayed = [
    {
      id: "1",
      title: "Нещодавня пісня 1",
      artist: "Артист 1",
      album: "Альбом 1",
      coverUrl: "/placeholder.svg?height=300&width=300",
      playedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Нещодавня пісня 2",
      artist: "Артист 2",
      album: "Альбом 2",
      coverUrl: "/placeholder.svg?height=300&width=300",
      playedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return NextResponse.json(recentlyPlayed)
}

