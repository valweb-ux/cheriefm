export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function POST() {
  // Статична заглушка для контактної форми
  return NextResponse.json({ success: true })
}

