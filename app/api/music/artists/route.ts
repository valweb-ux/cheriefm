export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для артистів
  const artists = [
    {
      id: "1",
      name: "Артист 1",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 10,
    },
    {
      id: "2",
      name: "Артист 2",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 15,
    },
  ]

  return NextResponse.json(artists)
}

