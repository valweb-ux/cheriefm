export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для поточної програми
  const currentShow = {
    id: "1",
    title: "Ранкове шоу",
    description: "Найкраще ранкове шоу",
    host: "Ведучий 1",
    startTime: "08:00",
    endTime: "10:00",
    progress: 0.5,
    nextShow: {
      id: "2",
      title: "Музичний блок",
      startTime: "10:00",
      endTime: "12:00",
    },
  }

  return NextResponse.json(currentShow)
}

