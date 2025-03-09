export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для категорій плейлистів
  const categories = [
    {
      id: "1",
      name: "Поп",
      image: "/placeholder.svg?height=300&width=300",
      playlists: 10,
    },
    {
      id: "2",
      name: "Рок",
      image: "/placeholder.svg?height=300&width=300",
      playlists: 8,
    },
    {
      id: "3",
      name: "Електронна",
      image: "/placeholder.svg?height=300&width=300",
      playlists: 12,
    },
  ]

  return NextResponse.json(categories)
}

