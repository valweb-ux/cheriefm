export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для розкладу на сьогодні
  const todaySchedule = [
    {
      id: "1",
      title: "Ранкове шоу",
      description: "Найкраще ранкове шоу",
      host: "Ведучий 1",
      startTime: "08:00",
      endTime: "10:00",
    },
    {
      id: "2",
      title: "Музичний блок",
      description: "Найкраща музика",
      host: "Ведучий 2",
      startTime: "10:00",
      endTime: "12:00",
    },
    {
      id: "3",
      title: "Новини",
      description: "Останні новини",
      host: "Ведучий 3",
      startTime: "12:00",
      endTime: "13:00",
    },
  ]

  return NextResponse.json(todaySchedule)
}

