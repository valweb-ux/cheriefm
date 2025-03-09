export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для улюблених треків
  const favorites = [
    {
      id: "1",
      title: "Улюблена пісня 1",
      artist: "Артист 1",
      album: "Альбом 1",
      coverUrl: "/placeholder.svg?height=300&width=300",
      duration: "3:45",
    },
    {
      id: "2",
      title: "Улюблена пісня 2",
      artist: "Артист 2",
      album: "Альбом 2",
      coverUrl: "/placeholder.svg?height=300&width=300",
      duration: "4:20",
    },
  ]

  return NextResponse.json(favorites)
}

export async function POST(request: Request) {
  // Статична заглушка для додавання треку до улюблених
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  // Статична заглушка для видалення треку з улюблених
  return NextResponse.json({ success: true })
}

