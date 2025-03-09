export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function POST() {
  // Статична заглушка для реєстрації на подію
  return NextResponse.json({ success: true, ticketId: Date.now().toString() })
}

