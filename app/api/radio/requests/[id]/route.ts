export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для запиту на пісню
  const songRequest = {
    id,
    trackTitle: "Пісня " + id,
    artist: "Артист",
    requestedBy: "Слухач",
    requestedAt: new Date().toISOString(),
    status: "pending",
    message: "Будь ласка, зіграйте цю пісню для мене!",
    scheduledFor: null,
  }

  return NextResponse.json(songRequest)
}

export async function PUT() {
  // Статична заглушка для оновлення запиту на пісню
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  // Статична заглушка для видалення запиту на пісню
  return NextResponse.json({ success: true })
}

