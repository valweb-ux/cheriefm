export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для дорожнього руху
  const traffic = {
    city: "Київ",
    status: "Середній",
    incidents: [
      {
        id: "1",
        location: "Проспект Перемоги",
        description: "Затор через ремонтні роботи",
        severity: "high",
        startTime: new Date().toISOString(),
        endTime: null,
      },
      {
        id: "2",
        location: "Вулиця Хрещатик",
        description: "Перекрито рух через захід",
        severity: "medium",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      },
    ],
    routes: [
      {
        from: "Центр",
        to: "Оболонь",
        status: "Затори",
        travelTime: "30 хв",
      },
      {
        from: "Центр",
        to: "Позняки",
        status: "Вільно",
        travelTime: "20 хв",
      },
    ],
  }

  return NextResponse.json(traffic)
}

