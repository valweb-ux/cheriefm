export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для активних реклам
  const adverts = [
    {
      id: "1",
      title: "Активна реклама 1",
      description: "Опис реклами 1",
      audioUrl: "/sample-audio.mp3",
      duration: "30",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      sponsor: "Спонсор 1",
    },
    {
      id: "2",
      title: "Активна реклама 2",
      description: "Опис реклами 2",
      audioUrl: "/sample-audio.mp3",
      duration: "15",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      sponsor: "Спонсор 2",
    },
  ]

  return NextResponse.json(adverts)
}

