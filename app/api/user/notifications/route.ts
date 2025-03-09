export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для сповіщень користувача
  const notifications = [
    {
      id: "1",
      title: "Нове повідомлення",
      message: "У вас нове повідомлення",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Оновлення програми",
      message: "Програма оновлена",
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return NextResponse.json(notifications)
}

export async function PUT() {
  // Статична заглушка для оновлення сповіщень
  return NextResponse.json({ success: true })
}

