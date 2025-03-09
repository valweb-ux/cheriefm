export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function POST() {
  // Статична заглушка для підписки на розсилку
  return NextResponse.json({ success: true })
}

