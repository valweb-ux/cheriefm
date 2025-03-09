export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для улюбленого треку
  const favorite = {
    id,
    title: "Улюблена пісня " + id,
    artist: "Артист",
    album: "Альбом",
    coverUrl: "/placeholder.svg?height=300&width=300",
    duration: "3:45",
    addedAt: new Date().toISOString(),
  }

  return NextResponse.json(favorite)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // Статична заглушка для видалення треку з улюблених
  return NextResponse.json({ success: true })
}

