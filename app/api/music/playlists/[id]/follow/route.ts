export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function POST() {
  // Статична заглушка для підписки на плейлист
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  // Статична заглушка для відписки від плейлиста
  return NextResponse.json({ success: true })
}

