export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function POST() {
  // Статична заглушка для дублювання плейлиста
  return NextResponse.json({ success: true, id: Date.now().toString() })
}

