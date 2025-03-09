export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для налаштувань користувача
  const preferences = {
    theme: "light",
    notifications: true,
    language: "uk",
    autoplay: true,
  }

  return NextResponse.json(preferences)
}

export async function PUT() {
  // Статична заглушка для оновлення налаштувань
  return NextResponse.json({ success: true })
}

