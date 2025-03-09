export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для профілю користувача
  const profile = {
    id: "1",
    name: "Користувач",
    email: "user@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    createdAt: new Date().toISOString(),
    preferences: {
      theme: "light",
      notifications: true,
    },
  }

  return NextResponse.json(profile)
}

export async function PUT() {
  // Статична заглушка для оновлення профілю
  return NextResponse.json({ success: true })
}

