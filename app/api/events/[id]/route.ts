export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для події
  const event = {
    id,
    title: "Подія " + id,
    description: "Опис події " + id,
    image: "/placeholder.svg?height=300&width=300",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Київ, Україна",
    organizer: "Організатор",
    tickets: [
      {
        id: "1",
        type: "Стандарт",
        price: 100,
        available: true,
      },
      {
        id: "2",
        type: "VIP",
        price: 200,
        available: true,
      },
    ],
  }

  return NextResponse.json(event)
}

