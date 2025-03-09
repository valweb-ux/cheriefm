export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для статистики плейлиста
  const stats = {
    plays: 1000,
    likes: 50,
    followers: 30,
    shares: 10,
    comments: 20,
    topTracks: [
      {
        id: "1",
        title: "Пісня 1",
        artist: "Виконавець 1",
        plays: 200,
      },
      {
        id: "2",
        title: "Пісня 2",
        artist: "Виконавець 2",
        plays: 150,
      },
      {
        id: "3",
        title: "Пісня 3",
        artist: "Виконавець 3",
        plays: 100,
      },
    ],
    playsByDay: [
      { date: "2023-01-01", count: 50 },
      { date: "2023-01-02", count: 60 },
      { date: "2023-01-03", count: 45 },
      { date: "2023-01-04", count: 70 },
      { date: "2023-01-05", count: 80 },
      { date: "2023-01-06", count: 65 },
      { date: "2023-01-07", count: 55 },
    ],
  }

  return NextResponse.json(stats)
}

