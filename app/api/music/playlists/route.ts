export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для плейлистів
  const playlists = [
    {
      id: "1",
      title: "Ранковий плейлист",
      description: "Музика для бадьорого ранку",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 15,
    },
    {
      id: "2",
      title: "Вечірній плейлист",
      description: "Музика для розслаблення ввечері",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 20,
    },
  ]

  return NextResponse.json(playlists)
}

