export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для статистики реклами
  const stats = {
    totalAdverts: 10,
    activeAdverts: 5,
    totalPlays: 1000,
    totalClicks: 200,
    clickThroughRate: 0.2,
    topAdverts: [
      {
        id: "1",
        title: "Реклама 1",
        plays: 300,
        clicks: 60,
      },
      {
        id: "2",
        title: "Реклама 2",
        plays: 200,
        clicks: 40,
      },
    ],
  }

  return NextResponse.json(stats)
}

