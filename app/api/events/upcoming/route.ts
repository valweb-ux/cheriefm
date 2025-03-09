export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для майбутніх подій
  const events = [
    {
      id: "1",
      title: "Концерт",
      description: "Опис концерту",
      image: "/placeholder.svg?height=300&width=300",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Київ, Україна",
    },
    {
      id: "2",
      title: "Фестиваль",
      description: "Опис фестивалю",
      image: "/placeholder.svg?height=300&width=300",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Львів, Україна",
    },
  ]

  return NextResponse.json(events)
}

