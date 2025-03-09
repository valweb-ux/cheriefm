export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для наступної програми
  const nextShow = {
    id: "2",
    title: "Музичний блок",
    description: "Найкраща музика",
    host: "Ведучий 2",
    startTime: "10:00",
    endTime: "12:00",
    startsIn: "01:30:00",
  }

  return NextResponse.json(nextShow)
}

