export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для чартів
  const charts = [
    {
      id: "1",
      title: "Топ 10 тижня",
      description: "Найпопулярніші треки тижня",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 10,
    },
    {
      id: "2",
      title: "Топ 20 місяця",
      description: "Найпопулярніші треки місяця",
      image: "/placeholder.svg?height=300&width=300",
      tracks: 20,
    },
  ]

  return NextResponse.json(charts)
}

