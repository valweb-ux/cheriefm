export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для джинглів
  const jingles = [
    {
      id: "1",
      title: "Джингл 1",
      audioUrl: "/sample-audio.mp3",
      duration: "5",
      type: "station-id",
    },
    {
      id: "2",
      title: "Джингл 2",
      audioUrl: "/sample-audio.mp3",
      duration: "3",
      type: "transition",
    },
  ]

  return NextResponse.json(jingles)
}

