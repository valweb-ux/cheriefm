export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для поширення плейлиста
  return NextResponse.json({ success: true, shareUrl: `https://example.com/shared-playlist/${id}` })
}

