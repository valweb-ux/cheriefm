export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function POST() {
  // Статична заглушка для поширення поста
  return NextResponse.json({ success: true })
}

