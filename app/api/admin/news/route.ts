export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для новин
  const news = [
    {
      id: "1",
      title: "Новина 1",
      content: "Зміст новини 1",
      image: "/placeholder.svg?height=300&width=300",
      categoryId: "1",
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Новина 2",
      content: "Зміст новини 2",
      image: "/placeholder.svg?height=300&width=300",
      categoryId: "2",
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  return NextResponse.json(news)
}

export async function POST() {
  // Статична заглушка для створення новини
  return NextResponse.json({ success: true, id: Date.now().toString() })
}

