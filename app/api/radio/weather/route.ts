export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для погоди
  const weather = {
    city: "Київ",
    temperature: 20,
    condition: "Сонячно",
    icon: "sun",
    humidity: 60,
    windSpeed: 5,
    forecast: [
      {
        day: "Сьогодні",
        temperature: { min: 15, max: 25 },
        condition: "Сонячно",
        icon: "sun",
      },
      {
        day: "Завтра",
        temperature: { min: 14, max: 22 },
        condition: "Хмарно",
        icon: "cloud",
      },
      {
        day: "Післязавтра",
        temperature: { min: 12, max: 20 },
        condition: "Дощ",
        icon: "rain",
      },
    ],
  }

  return NextResponse.json(weather)
}

