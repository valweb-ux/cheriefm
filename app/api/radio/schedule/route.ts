export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для розкладу радіо
  const schedule = [
    {
      id: "1",
      title: "Ранкове шоу",
      start: "08:00",
      end: "10:00",
      host: "Ведучий 1",
      description: "Опис програми",
    },
    {
      id: "2",
      title: "Музичний блок",
      start: "10:00",
      end: "12:00",
      host: "Ведучий 2",
      description: "Опис програми",
    },
  ]

  return NextResponse.json(schedule)
}

