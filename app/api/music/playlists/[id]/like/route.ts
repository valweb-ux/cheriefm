export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function POST() {
  // Статична заглушка для додавання плейлиста до улюблених
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  // Статична заглушка для видалення плейлиста з улюблених
  return NextResponse.json({ success: true })
}

