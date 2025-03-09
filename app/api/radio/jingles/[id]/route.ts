export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для джингла
  const jingle = {
    id,
    title: "Джингл " + id,
    audioUrl: "/sample-audio.mp3",
    duration: "5",
    type: "station-id",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(jingle)
}

