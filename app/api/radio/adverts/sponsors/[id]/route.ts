export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для спонсора
  const sponsor = {
    id,
    name: "Спонсор " + id,
    logo: "/placeholder.svg?height=100&width=100",
    website: "https://example.com",
    description: "Опис спонсора " + id,
    contactPerson: "Контактна особа",
    contactEmail: "contact@example.com",
    contactPhone: "+380123456789",
    adverts: [
      {
        id: "1",
        title: "Реклама 1",
        description: "Опис реклами 1",
        audioUrl: "/sample-audio.mp3",
        duration: "30",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        title: "Реклама 2",
        description: "Опис реклами 2",
        audioUrl: "/sample-audio.mp3",
        duration: "15",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  }

  return NextResponse.json(sponsor)
}

