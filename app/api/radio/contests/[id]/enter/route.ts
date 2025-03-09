export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function POST() {
  // Статична заглушка для участі в конкурсі
  return NextResponse.json({ success: true, entryId: Date.now().toString() })
}

