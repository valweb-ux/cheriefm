export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для радіо-шоу
  const shows = [
    {
      id: "1",
      title: "Ранкове шоу",
      host: "Ведучий 1",
      description: "Опис програми",
      image: "/placeholder.svg?height=300&width=300",
      schedule: "Пн-Пт, 08:00-10:00",
    },
    {
      id: "2",
      title: "Музичний блок",
      host: "Ведучий 2",
      description: "Опис програми",
      image: "/placeholder.svg?height=300&width=300",
      schedule: "Пн-Пт, 10:00-12:00",
    },
  ]

  return NextResponse.json(shows)
}

