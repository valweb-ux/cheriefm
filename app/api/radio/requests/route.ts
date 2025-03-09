export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для запитів на пісні
  const requests = [
    {
      id: "1",
      trackTitle: "Пісня 1",
      artist: "Артист 1",
      requestedBy: "Слухач 1",
      requestedAt: new Date().toISOString(),
      status: "pending",
    },
    {
      id: "2",
      trackTitle: "Пісня 2",
      artist: "Артист 2",
      requestedBy: "Слухач 2",
      requestedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: "approved",
    },
  ]

  return NextResponse.json(requests)
}

export async function POST() {
  // Статична заглушка для створення запиту на пісню
  return NextResponse.json({ success: true, id: Date.now().toString() })
}

