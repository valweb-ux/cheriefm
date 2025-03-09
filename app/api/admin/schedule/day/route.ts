export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для розкладу на день
  const schedule = [
    {
      id: "1",
      title: "Ранкове шоу",
      start: "08:00",
      end: "10:00",
      programId: "1",
      day: "monday",
    },
    {
      id: "2",
      title: "Музичний блок",
      start: "10:00",
      end: "12:00",
      programId: "2",
      day: "monday",
    },
  ]

  return NextResponse.json(schedule)
}

export async function POST() {
  // Статична заглушка для створення запису в розкладі
  return NextResponse.json({ success: true, id: Date.now().toString() })
}

