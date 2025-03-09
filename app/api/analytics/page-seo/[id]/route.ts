export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для SEO даних
  const seoData = {
    id,
    title: "Сторінка " + id,
    description: "Опис сторінки " + id,
    keywords: "ключові слова, радіо, музика",
    ogImage: "/placeholder.svg?height=600&width=1200",
    views: 100,
    uniqueVisitors: 50,
    averageTimeOnPage: "2:30",
  }

  return NextResponse.json(seoData)
}

