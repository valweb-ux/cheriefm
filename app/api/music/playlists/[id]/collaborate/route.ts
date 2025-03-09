export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function POST() {
  // Статична заглушка для додавання співавтора до плейлиста
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  // Статична заглушка для видалення співавтора з плейлиста
  return NextResponse.json({ success: true })
}

