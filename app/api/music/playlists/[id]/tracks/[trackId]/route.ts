export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string; trackId: string } }) {
  const { id, trackId } = params

  // Статична заглушка для треку в плейлисті
  const track = {
    id: trackId,
    title: "Пісня " + trackId,
    artist: "Виконавець",
    album: "Альбом",
    coverUrl: "/placeholder.svg?height=300&width=300",
    duration: "3:45",
    position: Number.parseInt(trackId),
    addedAt: new Date().toISOString(),
  }

  return NextResponse.json(track)
}

export async function PUT() {
  // Статична заглушка для оновлення треку в плейлисті
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  // Статична заглушка для видалення треку з плейлиста
  return NextResponse.json({ success: true })
}

