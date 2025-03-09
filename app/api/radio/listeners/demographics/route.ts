export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для демографії слухачів
  const demographics = {
    gender: [
      { gender: "Male", percentage: 55 },
      { gender: "Female", percentage: 45 },
    ],
    age: [
      { range: "18-24", percentage: 15 },
      { range: "25-34", percentage: 30 },
      { range: "35-44", percentage: 25 },
      { range: "45-54", percentage: 15 },
      { range: "55+", percentage: 15 },
    ],
    location: [
      { city: "Київ", percentage: 30 },
      { city: "Львів", percentage: 15 },
      { city: "Одеса", percentage: 10 },
      { city: "Харків", percentage: 10 },
      { city: "Дніпро", percentage: 8 },
      { city: "Інші", percentage: 27 },
    ],
    devices: [
      { device: "Mobile", percentage: 60 },
      { device: "Desktop", percentage: 30 },
      { device: "Tablet", percentage: 8 },
      { device: "Smart Speaker", percentage: 2 },
    ],
  }

  return NextResponse.json(demographics)
}

