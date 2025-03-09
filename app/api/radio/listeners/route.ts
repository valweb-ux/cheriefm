export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для статистики слухачів
  const listeners = {
    current: 1000,
    peak: 1500,
    peakTime: new Date().toISOString(),
    average: 800,
    byHour: [
      { hour: 0, count: 200 },
      { hour: 1, count: 150 },
      { hour: 2, count: 100 },
      { hour: 3, count: 80 },
      { hour: 4, count: 70 },
      { hour: 5, count: 100 },
      { hour: 6, count: 300 },
      { hour: 7, count: 500 },
      { hour: 8, count: 800 },
      { hour: 9, count: 1000 },
      { hour: 10, count: 1200 },
      { hour: 11, count: 1300 },
      { hour: 12, count: 1400 },
      { hour: 13, count: 1300 },
      { hour: 14, count: 1200 },
      { hour: 15, count: 1100 },
      { hour: 16, count: 1000 },
      { hour: 17, count: 1100 },
      { hour: 18, count: 1200 },
      { hour: 19, count: 1300 },
      { hour: 20, count: 1200 },
      { hour: 21, count: 1000 },
      { hour: 22, count: 800 },
      { hour: 23, count: 500 },
    ],
    byDay: [
      { day: "Monday", count: 900 },
      { day: "Tuesday", count: 950 },
      { day: "Wednesday", count: 1000 },
      { day: "Thursday", count: 1050 },
      { day: "Friday", count: 1100 },
      { day: "Saturday", count: 800 },
      { day: "Sunday", count: 700 },
    ],
  }

  return NextResponse.json(listeners)
}

