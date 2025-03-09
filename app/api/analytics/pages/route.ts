export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для аналітики сторінок
  const pages = [
    {
      id: "1",
      path: "/",
      title: "Головна",
      views: 5000,
      uniqueVisitors: 2500,
    },
    {
      id: "2",
      path: "/news",
      title: "Новини",
      views: 3000,
      uniqueVisitors: 1500,
    },
    {
      id: "3",
      path: "/radio",
      title: "Радіо",
      views: 2000,
      uniqueVisitors: 1000,
    },
  ]

  return NextResponse.json(pages)
}

