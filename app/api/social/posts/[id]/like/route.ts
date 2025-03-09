export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function POST() {
  // Статична заглушка для лайку поста
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  // Статична заглушка для видалення лайку поста
  return NextResponse.json({ success: true })
}

