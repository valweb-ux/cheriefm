export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для активних конкурсів
  const contests = [
    {
      id: "1",
      title: "Активний конкурс 1",
      description: "Опис конкурсу 1",
      prize: "Приз 1",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    },
    {
      id: "2",
      title: "Активний конкурс 2",
      description: "Опис конкурсу 2",
      prize: "Приз 2",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    },
  ]

  return NextResponse.json(contests)
}

