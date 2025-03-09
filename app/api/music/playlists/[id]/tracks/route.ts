export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для треків плейлиста
  const tracks = [
    {
      id: "1",
      title: "Пісня 1",
      artist: "Виконавець 1",
      album: "Альбом 1",
      coverUrl: "/placeholder.svg?height=300&width=300",
      duration: "3:45",
      position: 1,
    },
    {
      id: "2",
      title: "Пісня 2",
      artist: "Виконавець 2",
      album: "Альбом 2",
      coverUrl: "/placeholder.svg?height=300&width=300",
      duration: "4:20",
      position: 2,
    },
    {
      id: "3",
      title: "Пісня 3",
      artist: "Виконавець 3",
      album: "Альбом 3",
      coverUrl: "/placeholder.svg?height=300&width=300",
      duration: "3:30",
      position: 3,
    },
  ]

  return NextResponse.json(tracks)
}

export async function POST() {
  // Статична заглушка для додавання треку до плейлиста
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  // Статична заглушка для видалення треку з плейлиста
  return NextResponse.json({ success: true })
}

