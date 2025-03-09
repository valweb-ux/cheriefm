export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function POST() {
  // Статична заглушка для імпорту плейлиста
  return NextResponse.json({ success: true, id: Date.now().toString() })
}

