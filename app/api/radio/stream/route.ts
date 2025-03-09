export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для потоку радіо
  const stream = {
    url: "https://example.com/stream",
    format: "audio/mpeg",
    bitrate: 128,
    name: "Cherie FM",
    description: "Найкраще радіо",
  }

  return NextResponse.json(stream)
}

