export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function PUT() {
  // Статична заглушка для зміни порядку треків у плейлисті
  return NextResponse.json({ success: true })
}

