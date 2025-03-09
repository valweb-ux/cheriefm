export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string; episodeId: string } }) {
  const { id, episodeId } = params

  // Статична заглушка для епізоду подкасту
  const episode = {
    id: episodeId,
    podcastId: id,
    title: "Епізод " + episodeId,
    description: "Опис епізоду " + episodeId,
    duration: "30:00",
    date: new Date().toISOString(),
    audioUrl: "/sample-audio.mp3",
    transcript: "Текст епізоду...",
  }

  return NextResponse.json(episode)
}

