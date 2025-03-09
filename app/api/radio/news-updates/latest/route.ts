export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для останніх новинних оновлень
  const latestNewsUpdates = [
    {
      id: "1",
      title: "Останнє новинне оновлення 1",
      content: "Зміст новинного оновлення 1",
      category: "Політика",
      publishedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Останнє новинне оновлення 2",
      content: "Зміст новинного оновлення 2",
      category: "Спорт",
      publishedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "Останнє новинне оновлення 3",
      content: "Зміст новинного оновлення 3",
      category: "Економіка",
      publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ]

  return NextResponse.json(latestNewsUpdates)
}

