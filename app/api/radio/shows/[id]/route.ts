export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для радіо-шоу
  const show = {
    id,
    title: "Шоу " + id,
    host: "Ведучий",
    description: "Опис програми",
    image: "/placeholder.svg?height=300&width=300",
    schedule: "Пн-Пт, 08:00-10:00",
    episodes: [
      {
        id: "1",
        title: "Епізод 1",
        date: new Date().toISOString(),
        duration: "1:00:00",
        description: "Опис епізоду",
      },
      {
        id: "2",
        title: "Епізод 2",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        duration: "1:00:00",
        description: "Опис епізоду",
      },
    ],
  }

  return NextResponse.json(show)
}

