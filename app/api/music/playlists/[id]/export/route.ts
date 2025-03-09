export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для експорту плейлиста
  const exportData = {
    id,
    title: "Плейлист " + id,
    description: "Опис плейлиста " + id,
    tracks: [
      {
        id: "1",
        title: "Пісня 1",
        artist: "Виконавець 1",
        album: "Альбом 1",
        duration: "3:45",
      },
      {
        id: "2",
        title: "Пісня 2",
        artist: "Виконавець 2",
        album: "Альбом 2",
        duration: "4:20",
      },
      {
        id: "3",
        title: "Пісня 3",
        artist: "Виконавець 3",
        album: "Альбом 3",
        duration: "3:30",
      },
    ],
    exportFormat: "json",
    exportedAt: new Date().toISOString(),
  }

  return NextResponse.json(exportData)
}

