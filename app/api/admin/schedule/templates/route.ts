export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для шаблонів розкладу
  const templates = [
    {
      id: "1",
      name: "Стандартний розклад",
      description: "Стандартний розклад на тиждень",
    },
    {
      id: "2",
      name: "Святковий розклад",
      description: "Розклад для святкових днів",
    },
  ]

  return NextResponse.json(templates)
}

export async function POST() {
  // Статична заглушка для створення шаблону розкладу
  return NextResponse.json({ success: true, id: Date.now().toString() })
}

