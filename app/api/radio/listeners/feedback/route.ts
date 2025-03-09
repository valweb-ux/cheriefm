export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для відгуків слухачів
  const feedback = [
    {
      id: "1",
      name: "Слухач 1",
      message: "Дуже подобається ваше радіо!",
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Слухач 2",
      message: "Хороша музика, але хотілося б більше новин.",
      rating: 4,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return NextResponse.json(feedback)
}

export async function POST() {
  // Статична заглушка для створення відгуку
  return NextResponse.json({ success: true, id: Date.now().toString() })
}

