export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для новинних оновлень
  const newsUpdates = [
    {
      id: "1",
      title: "Новинне оновлення 1",
      content: "Зміст новинного оновлення 1",
      category: "Політика",
      publishedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Новинне оновлення 2",
      content: "Зміст новинного оновлення 2",
      category: "Спорт",
      publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ]

  return NextResponse.json(newsUpdates)
}

