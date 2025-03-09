export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для новин
  const news = [
    {
      id: "1",
      title: "Новина 1",
      excerpt: "Короткий опис новини 1",
      image: "/placeholder.svg?height=300&width=300",
      category: "Музика",
      date: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Новина 2",
      excerpt: "Короткий опис новини 2",
      image: "/placeholder.svg?height=300&width=300",
      category: "Культура",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return NextResponse.json(news)
}

