export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для ведучого
  const host = {
    id,
    name: "Ведучий " + id,
    bio: "Біографія ведучого " + id,
    image: "/placeholder.svg?height=300&width=300",
    email: "host@example.com",
    socialMedia: {
      facebook: "https://facebook.com/host",
      twitter: "https://twitter.com/host",
      instagram: "https://instagram.com/host",
    },
    shows: [
      {
        id: "1",
        title: "Шоу 1",
        description: "Опис шоу 1",
        schedule: "Пн-Пт, 08:00-10:00",
      },
      {
        id: "2",
        title: "Шоу 2",
        description: "Опис шоу 2",
        schedule: "Сб-Нд, 10:00-12:00",
      },
    ],
  }

  return NextResponse.json(host)
}

