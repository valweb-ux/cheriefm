export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для співавторів плейлиста
  const collaborators = [
    {
      id: "1",
      name: "Користувач 1",
      avatar: "/placeholder.svg?height=50&width=50",
      addedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Користувач 2",
      avatar: "/placeholder.svg?height=50&width=50",
      addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return NextResponse.json(collaborators)
}

