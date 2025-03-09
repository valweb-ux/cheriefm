export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для новинного оновлення
  const newsUpdate = {
    id,
    title: "Новинне оновлення " + id,
    content: "Зміст новинного оновлення " + id,
    category: "Політика",
    publishedAt: new Date().toISOString(),
    author: "Автор",
    source: "Джерело",
    relatedNews: [
      {
        id: "1",
        title: "Пов'язана новина 1",
        url: "/news/1",
      },
      {
        id: "2",
        title: "Пов'язана новина 2",
        url: "/news/2",
      },
    ],
  }

  return NextResponse.json(newsUpdate)
}

