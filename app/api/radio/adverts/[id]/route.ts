export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для реклами
  const advert = {
    id,
    title: "Реклама " + id,
    description: "Опис реклами " + id,
    audioUrl: "/sample-audio.mp3",
    duration: "30",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    sponsor: "Спонсор",
    plays: 100,
    clicks: 20,
  }

  return NextResponse.json(advert)
}

export async function PUT() {
  // Статична заглушка для оновлення реклами
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  // Статична заглушка для видалення реклами
  return NextResponse.json({ success: true })
}

