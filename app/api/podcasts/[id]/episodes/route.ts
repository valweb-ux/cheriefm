export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для епізодів подкасту
  const episodes = [
    {
      id: "1",
      title: "Епізод 1",
      description: "Опис епізоду 1",
      duration: "30:00",
      date: new Date().toISOString(),
      audioUrl: "/sample-audio.mp3",
    },
    {
      id: "2",
      title: "Епізод 2",
      description: "Опис епізоду 2",
      duration: "45:00",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      audioUrl: "/sample-audio.mp3",
    },
  ]

  return NextResponse.json(episodes)
}

