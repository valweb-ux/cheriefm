export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для історії змін плейлиста
  const history = [
    {
      id: "1",
      action: "create",
      user: "Користувач 1",
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      details: "Створено плейлист",
    },
    {
      id: "2",
      action: "add_track",
      user: "Користувач 1",
      timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      details: 'Додано трек "Пісня 1"',
    },
    {
      id: "3",
      action: "add_track",
      user: "Користувач 2",
      timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      details: 'Додано трек "Пісня 2"',
    },
    {
      id: "4",
      action: "remove_track",
      user: "Користувач 1",
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      details: 'Видалено трек "Пісня 3"',
    },
    {
      id: "5",
      action: "update",
      user: "Користувач 1",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      details: "Оновлено опис плейлиста",
    },
  ]

  return NextResponse.json(history)
}

