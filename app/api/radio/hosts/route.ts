export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для ведучих
  const hosts = [
    {
      id: "1",
      name: "Ведучий 1",
      bio: "Біографія ведучого 1",
      image: "/placeholder.svg?height=300&width=300",
      shows: ["1", "2"],
    },
    {
      id: "2",
      name: "Ведучий 2",
      bio: "Біографія ведучого 2",
      image: "/placeholder.svg?height=300&width=300",
      shows: ["3"],
    },
  ]

  return NextResponse.json(hosts)
}

