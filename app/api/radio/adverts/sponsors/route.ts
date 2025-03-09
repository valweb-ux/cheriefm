export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для спонсорів реклами
  const sponsors = [
    {
      id: "1",
      name: "Спонсор 1",
      logo: "/placeholder.svg?height=100&width=100",
      website: "https://example.com",
      adverts: 3,
    },
    {
      id: "2",
      name: "Спонсор 2",
      logo: "/placeholder.svg?height=100&width=100",
      website: "https://example.com",
      adverts: 2,
    },
  ]

  return NextResponse.json(sponsors)
}

